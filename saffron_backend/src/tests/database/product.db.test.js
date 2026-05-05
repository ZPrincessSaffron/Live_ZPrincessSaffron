import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../models/productModel.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

describe("Product Model Database Tests", () => {
    const validProductData = {
        id: 1,
        name: "Saffron Premium",
        price: 500,
        image: "saffron.jpg",
        category: "Spice",
        description: "Best quality saffron",
        stock: 10
    };

    describe("Create & Save", () => {
        it("should save a product correctly", async () => {
            const product = new Product(validProductData);
            const savedProduct = await product.save();

            expect(savedProduct._id).toBeDefined();
            expect(savedProduct.id).toBe(validProductData.id);
            expect(savedProduct.name).toBe(validProductData.name);
        });
    });

    describe("Validation", () => {
        it("should fail to save with negative price", async () => {
            const product = new Product({ ...validProductData, price: -100 });
            let err;
            try {
                await product.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.price).toBeDefined();
            expect(err.errors.price.message).toBe("Price cannot be negative");
        });

        it("should fail to save with negative stock", async () => {
            const product = new Product({ ...validProductData, stock: -5 });
            let err;
            try {
                await product.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.stock).toBeDefined();
            expect(err.errors.stock.message).toBe("Stock cannot be negative");
        });

        it("should fail to save without required fields", async () => {
            const product = new Product({ name: "Incomplete" });
            let err;
            try {
                await product.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.id).toBeDefined();
            expect(err.errors.price).toBeDefined();
        });
    });

    describe("Uniqueness", () => {
        it("should fail to save products with duplicate custom id", async () => {
            await Product.create(validProductData);
            const duplicateProduct = new Product(validProductData);

            let err;
            try {
                await duplicateProduct.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.code).toBe(11000);
        });
    });

    describe("Defaults", () => {
        it("should apply default values correctly", async () => {
            const product = await Product.create({
                id: 2,
                name: "Defaults Test",
                price: 100,
                image: "i.jpg",
                category: "C",
                description: "D"
            });
            expect(product.rating).toBe(5.0);
            expect(product.reviews).toBe(0);
            expect(product.stock).toBe(0);
            expect(product.tag).toBe("Out of Stock"); // Set by hook because stock is 0
        });
    });

    describe("Hooks (Pre-save)", () => {
        it("should set 'Out of Stock' tag when stock reaches 0", async () => {
            const product = await Product.create(validProductData);
            product.stock = 0;
            await product.save();
            expect(product.tag).toBe("Out of Stock");
        });

        it("should clear 'Out of Stock' tag when stock is replenished", async () => {
            const product = await Product.create({ ...validProductData, stock: 0 });
            expect(product.tag).toBe("Out of Stock");

            product.stock = 5;
            await product.save();
            expect(product.tag).toBe("");
        });
    });

    describe("Queries", () => {
        it("should find, update, and delete a product", async () => {
            const product = await Product.create(validProductData);

            const found = await Product.findOne({ id: 1 });
            expect(found.name).toBe("Saffron Premium");

            found.price = 600;
            await found.save();
            const updated = await Product.findById(product._id);
            expect(updated.price).toBe(600);

            await Product.deleteOne({ _id: product._id });
            const deleted = await Product.findById(product._id);
            expect(deleted).toBeNull();
        });
    });
});
