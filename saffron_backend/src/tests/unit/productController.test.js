import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../models/productModel.js";
import { getProducts, createProduct, getProductById } from "../../controllers/productController.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("productController", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
        await Product.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("getProducts", () => {
        it("should return all products", async () => {
            await Product.create({
                id: 1,
                name: "Product 1",
                price: 100,
                category: "Cat 1",
                image: "img1.jpg",
                description: "Test description"
            });

            await getProducts({}, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ name: "Product 1" })
            ]));
        });
    });

    describe("createProduct", () => {
        it("should create a product successfully", async () => {
            mockReq = {
                body: {
                    id: 10,
                    name: "New Product",
                    price: 200,
                    category: "Cat 2",
                    image: "img2.jpg",
                    stock: 50,
                    description: "New product description"
                }
            };

            await createProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ name: "New Product" }));
        });

        it("should return 400 if product ID exists", async () => {
            await Product.create({ id: 10, name: "Existing", price: 10, category: "C", image: "i", description: "d" });

            mockReq = {
                body: { id: 10, name: "New", price: 20, category: "C", image: "i" }
            };

            await createProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Product with this ID already exists" });
        });
    });
});
