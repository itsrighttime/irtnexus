// swagger/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "Automatically generated Swagger docs",
    },
  },
  apis: ["src/swagger/**/*.js"], // relative to project root
};

export const swaggerSpec = swaggerJSDoc(options);
