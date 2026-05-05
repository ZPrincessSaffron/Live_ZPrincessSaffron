import request from "supertest";
import app from "../../app.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

describe("Chat Integration Tests", () => {
    it("should return static reply for brand keywords", async () => {
        const res = await request(app)
            .post("/api/chat")
            .send({ message: "What is Z Princess Saffron?" });

        expect(res.status).toBe(200);
        expect(res.body.reply).toContain("premium handpicked Kashmiri saffron");
    });

    it("should return static reply for shipping keywords", async () => {
        const res = await request(app)
            .post("/api/chat")
            .send({ message: "What are your shipping rates?" });

        expect(res.status).toBe(200);
        expect(res.body.reply).toContain("Free shipping on orders above ₹999");
    });
});
