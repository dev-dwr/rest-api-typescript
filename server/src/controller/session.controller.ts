import { findAndUpdateUser } from "./../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import {
  validatePassword,
  getGoogleOAuthTokens,
  getGoogleUser,
} from "../service/user.service";
import { CookieOptions, Request, Response } from "express";
import config from "config";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 9000000, // 15 minutes
  httpOnly: true, //secure feature
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 154e10,
};

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // Validate user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  // create session, we need to await async func
  const session = await createSession(user._id, req.get("user-agent") || "");
  // create access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTimeToLive") }
  );
  // create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTimeToLive") }
  );

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return res.send({ accessToken, refreshToken });
};

export const getUserSessionHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};

export const googleOAuthHandler = async (req: Request, res: Response) => {
  //get code from qs
  //get id and access token with the code
  //get user with tokens
  //create a session
  //create access and refresh token
  //set cookies, redirect back to client

  const code = req.query.code as string;
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    //const googleUser = jwt.decode(id_token); to get google user approach
    const googleUser = await getGoogleUser({ id_token, access_token });
    if (!googleUser.verified_email) {
      return res.status(403).send("google account is not verified");
    }
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email, //if user does not exist we find them by email and update
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true, //return new document given that it updated user
      }
    );

    const session = await createSession(user?._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      { ...user?.toJSON(), session: session._id },
      { expiresIn: config.get<string>("accessTokenTimeToLive") }
    );
    // create refresh token
    const refreshToken = signJwt(
      { ...user?.toJSON(), session: session._id },
      { expiresIn: config.get<string>("refreshTokenTimeToLive") }
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    res.redirect(config.get<string>("origin"));

  } catch (error: any) {
    logger.error(error, "failed to authorize google user");
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
};
