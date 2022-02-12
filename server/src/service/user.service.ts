import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import config from "config";
import axios from "axios";
import log from "../utils/logger";
import qs from "qs";

export const createUser = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), "password");
};

export const findUser = async (query: FilterQuery<UserDocument>) => {
  return UserModel.findOne(query).lean();
};

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export const getGoogleOAuthTokens = async ({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: config.get("googleClientId"),
    client_secret: config.get("googleClientSecret"),
    redirect_uri: config.get("googleOauthRedirectURI"),
    grant_type: "authorization_code",
  };

  try {
    // A querystring parsing and stringifying library
    const response = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (er: any) {
    console.error(er.response.data.error);
    log.error(er, "failed to fetch google oauth tokens");
    throw new Error(er.message);
  }
};

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
export const getGoogleUser = async ({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> => {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (er: any) {
    log.error(er, "error fetching google user");
    throw new Error(er.message);
  }
};

export const findAndUpdateUser = async (
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = {}
) => {
  return UserModel.findOneAndUpdate(query, update, options);
};
