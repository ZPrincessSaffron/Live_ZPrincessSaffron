import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Saffron API",
            version: "1.0.0",
            description: "API documentation for Saffron Backend",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;

//swagger API url:"http://localhost:5000/api-docs"
