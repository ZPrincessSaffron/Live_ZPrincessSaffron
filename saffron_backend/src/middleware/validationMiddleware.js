import Joi from "joi";

export const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorDetails = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validation error", errors: errorDetails });
    }
    next();
};

// Common Validation Schemas
export const schemas = {
    auth: {
        register: Joi.object({
            fullName: Joi.string().required().min(2),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6),
        }),
        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    },
    product: {
        create: Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().min(0).required(),
            originalPrice: Joi.number().min(0),
            image: Joi.string().required(),
            category: Joi.string().required(),
            stock: Joi.number().min(0),
            description: Joi.string(),
            tag: Joi.string(),
            rating: Joi.number().min(0).max(5),
            reviews: Joi.number().min(0),
        }),
    },
    cart: {
        addItem: Joi.object({
            product_id: Joi.number().required(),
            quantity: Joi.number().min(1).required(),
            price: Joi.number().min(0),
            name: Joi.string(),
            image: Joi.string(),
        }),
    },
};

