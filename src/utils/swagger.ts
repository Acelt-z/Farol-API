import SwaggerParser from "@apidevtools/swagger-parser";
import path from 'path';

export const getSwaggerDocument = async () => {
  const swaggerPath = path.join(process.cwd(), 'docs', 'openapi.yaml'); 
  const document = await SwaggerParser.dereference(swaggerPath);
  
  return document;
};