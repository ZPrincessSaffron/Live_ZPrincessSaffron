import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import { generateToken } from "../../config/generateToken.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

let mongoServer;
let adminToken;
let userToken;
let adminUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create users for testing protected routes
    adminUser = await User.create({
        fullName: "Admin User",
        email: "admin@example.com",
        password: "password123",
        isAdmin: true
    });
    adminToken = generateToken(adminUser._id, true);

    const regularUser = await User.create({
        fullName: "Regular User",
        email: "user@example.com",
        password: "password123",
        isAdmin: false
    });
    userToken = generateToken(regularUser._id, false);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("Product Integration Tests", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
    });

    describe("GET /api/products", () => {
        it("should return an empty array when no products exist", async () => {
            const res = await request(app).get("/api/products");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it("should return all products", async () => {
            await Product.create({
                id: 1,
                name: "Product 1",
                price: 100,
                category: "Category 1",
                image: "image1.jpg",
                description: "Description 1",
                stock: 10
            });

            const res = await request(app).get("/api/products");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe("Product 1");
        });
    });

    describe("POST /api/products", () => {
        const newProduct = {
            id: 10,
            name: "New Product",
            price: 150,
            category: "New Category",
            image: "new.jpg",
            description: "New Description",
            stock: 5
        };

        it("should create a product when authorized as admin", async () => {
            const res = await request(app)
                .post("/api/products")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newProduct);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe("New Product");

            const product = await Product.findOne({ id: 10 });
            expect(product).toBeDefined();
        });

        it("should fail to create product when not admin", async () => {
            const res = await request(app)
                .post("/api/products")
                .set("Authorization", `Bearer ${userToken}`)
                .send(newProduct);

            expect(res.status).toBe(403);
        });

        it("should fail to create product with negative price", async () => {
            const res = await request(app)
                .post("/api/products")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...newProduct, price: -10 });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Validation error");
            expect(res.body.errors).toBeDefined();
        });
    });

    describe("GET /api/products/:id", () => {
        it("should return product by MongoDB ID", async () => {
            const product = await Product.create({
                id: 1,
                name: "Test Product",
                price: 50,
                category: "C",
                image: "i.jpg",
                description: "D",
                stock: 1
            });

            const res = await request(app).get(`/api/products/${product._id}`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe("Test Product");
        });

        it("should return 404 for non-existent product", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/products/${fakeId}`);
            expect(res.status).toBe(404);
        });
    });

    describe("PUT /api/products/:id", () => {
        it("should update product as admin", async () => {
            const product = await Product.create({
                id: 1,
                name: "Old Name",
                price: 50,
                category: "C",
                image: "i.jpg",
                description: "D",
                stock: 1
            });

            const res = await request(app)
                .put(`/api/products/${product._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Updated Name", price: 60 });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe("Updated Name");
            expect(res.body.price).toBe(60);
        });
    });

    describe("DELETE /api/products/:id", () => {
        it("should delete product as admin", async () => {
            const product = await Product.create({
                id: 1,
                name: "To Delete",
                price: 50,
                category: "C",
                image: "i.jpg",
                description: "D",
                stock: 1
            });

            const res = await request(app)
                .delete(`/api/products/${product._id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Product deleted successfully");

            const deletedProduct = await Product.findById(product._id);
            expect(deletedProduct).toBeNull();
        });
    });
});
