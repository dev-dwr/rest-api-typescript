import { createUserSessionHandler } from "../controller/session.controller";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/server";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

const sampleUserPayload = {
  _id: userId,
  email: "dawid@gmail.com",
  name: "dawid rymar",
};
const sampleUserInput = {
  email: "dawid@gmail.com",
  password: "dupa1234",
  passwordConfirmation: "dupa1234",
  name: "dawid rymar",
};
const sampleSessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

describe("user", () => {
  describe("get user", () => {
    describe("given the user who is not authorized", () => {
      it("should return 403", async () => {
        const { statusCode, body } = await supertest(app).get("/api/me");
        expect(statusCode).toBe(403);
        expect(body).toEqual({});
      });
    });
  });

  describe("registration", () => {
    describe("given the username and password are valid", () => {
      it("should return user payload", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(sampleUserPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send(sampleUserInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(sampleUserPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(sampleUserInput);
      });
    });
    describe("given passwords dont match", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(sampleUserPayload);

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send({
            ...sampleUserInput,
            passwordConfirmation: "different confirmation password",
          });

        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given user service throws", () => {
      it("should return 409 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          .mockRejectedValueOnce("value was rejected as planned");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(sampleUserInput);

        expect(statusCode).toBe(409);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });
  describe("create session", () => {
    describe("given username and password are valid", () => {
      it("should return signed access token and refresh token", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          //@ts-ignore
          .mockReturnValue(sampleUserPayload);
        jest
          .spyOn(SessionService, "createSession")
          //@ts-ignore
          .mockReturnValue(sampleSessionPayload);

        const req = {
          get: () => "a user agent",
          body: {
            email: "dawid@gmail.com",
            password: "dupa123",
          },
        };
        const send = jest.fn();
        const cookie = jest.fn();
        const res = { send, cookie };

        //@ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
        expect(cookie).toBeCalled();
      });
    });
  });
});
