import { signJwt } from "../utils/jwt.utils";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { Request, Response } from "express";
import config from "config";

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
  
  res.cookie("accessToken", accessToken, {
    maxAge: 9000000, // 15 minutes
    httpOnly: true, //secure feature
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });
  
  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1y 
    httpOnly: true, //secure feature
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });
  // return access and refresh token
  return res.send({accessToken, refreshToken});
};


export const getUserSessionHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const sessions = await findSessions({user: userId, valid: true});

  return res.send(sessions);
}


export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.session;

  await updateSession({_id: sessionId}, {valid:false});

  return res.send({
    accessToken: null,
    refreshToken: null
  });
}