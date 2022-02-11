import { signJwt } from "../utils/jwt.utils";
import { createProduct } from "../service/product.service";
import supertest from "supertest";
import createServer from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

const sampleProductPayload = {
  user: userId,
  title: "Sample title",
  description:
    "Designed for first-time owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS",
  price: 69.69,
  image: "https://i.imgur.com/QlRphfQ.jpg",
};
const sampleUserPayload = {
  _id: userId,
  email: "dawid@gmail.com",
  name: "david rym",
};

describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        const productId = "product_1234";
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        const product = await createProduct(sampleProductPayload);
        const { body, statusCode } = await supertest(app)
          .get(`/api/products/${product.productId}`)
          .expect(200);

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/products");
        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 and create the product", async () => {
        const jwt = signJwt(sampleUserPayload);
        const { statusCode, body } = await supertest(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${jwt}`)
          .send(sampleProductPayload);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description: "Designed for first-time owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS",
          image: "https://i.imgur.com/QlRphfQ.jpg",
          price: 69.69,
          productId: expect.any(String),
          title: "Sample title",
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
