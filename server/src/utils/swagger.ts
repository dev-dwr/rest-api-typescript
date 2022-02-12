import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import log from "./logger";
import YAML from "yamljs";
import path from "path";

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "REST API Docs",
//       version,
//     },
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis: ["./src/routes.ts", "./src/schema/*.ts"],
// };
//const swaggerSpecification = swaggerJsdoc(options);

const swaggerSpec = YAML.load(path.resolve(__dirname) + "/swagger.yaml")
const swaggerDocs = (app: Express, port: number) => {
    //swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    //docs in json format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", 'application/json');
        res.send(swaggerSpec);
    });

    log.info(`Documentation available at http://localhost:${port}/docs`)
}

export default swaggerDocs;