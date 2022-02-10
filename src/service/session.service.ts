import { verifyJwt } from './../utils/jwt.utils';
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import {get} from "lodash";
import { findUser } from './user.service';
import config from "config";
import { signJwt } from './../utils/jwt.utils';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await SessionModel.create({
    user: userId,
    userAgent: userAgent,
  });

  return session.toJSON();
};

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  // lean option tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO
  return SessionModel.find(query).lean();
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return SessionModel.updateOne(query, update);
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {

  const {decoded} = verifyJwt(refreshToken);

  // we dont have id on decoded refresh token
  if(!decoded || !get(decoded, 'session')){
    return false;
  }

  const session = await SessionModel.findById(get(decoded, "session"));

  if(!session || !session.valid){
    return false;
  }
  
  const user = await findUser({_id: session.user});

  if(!user){
    return false;
  }
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTimeToLive") }
  );
  
  return accessToken;
};
