import { validateRequest } from "../../middleware/validationMiddleware.js";
import Joi from "joi";
import { jest } from "@jest/globals";

describe("validationMiddleware", () => {
    let mockReq, mockRes, next;

    beforeEach(() => {
        mockReq = { body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("should call next() if validation passes", () => {
        const schema = Joi.object({ name: Joi.string().required() });
        mockReq.body = { name: "Test" };
        
        const middleware = validateRequest(schema);
        middleware(mockReq, mockRes, next);
        
        expect(next).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should return 400 if validation fails", () => {
        const schema = Joi.object({ name: Joi.string().required() });
        mockReq.body = {}; // missing name
        
        const middleware = validateRequest(schema);
        middleware(mockReq, mockRes, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Validation error"
        }));
    });
});
