import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'yaml';

const initializeSwagger = (app: INestApplication) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const config = new DocumentBuilder()
        .addCookieAuth(process.env.COOKIE_NAME)
        .setTitle('HollyFilms API')
        .setDescription('The HollyFilms API description')
        .setVersion('0.1')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
      resolve(yaml.stringify(document));
    } catch (e) {
      reject(e);
    }
  });
};

export { initializeSwagger };
