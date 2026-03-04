import swaggerJsdoc from "swagger-jsdoc";
import SwaggerParser from "@apidevtools/swagger-parser";
import path from 'path';

export const getSwaggerDocument = async () => {
  const swaggerPath = path.join(process.cwd(), 'docs', 'openapi.yaml'); 
  
  // O dereference vai ler o openapi.yaml e substituir todos os $ref
  // pelo conteúdo real dos seus arquivos company.paths.yaml, etc.
  const document = await SwaggerParser.dereference(swaggerPath);
  
  return document;
};


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Farol das Finanças",
      version: "1.0.0",
      description: "API do ERP do Farol",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
