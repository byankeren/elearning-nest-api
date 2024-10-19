import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces/swagger-custom-options.interface';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe

interface User {
  id: string; // or your appropriate type
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable CORS
  app.enableCors({
    credentials: true,
  });

  // Set a global prefix for all routes
  app.setGlobalPrefix('api'); // All endpoints will start with /api

  // Add session middleware
  app.use(
    session({
      secret: 'your-secret-key', // Replace with your secret key
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 }, // 1 day
    }),
  );

  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user into the session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser((id: string, done) => {
    // Replace this with your user fetching logic
    const user: User = { id }; // Dummy user object
    done(null, user);
  });

  // Setup Swagger options including Bearer auth
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        name: 'Authorization',
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
      },
      'jwt', // Name of the security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom options for Swagger UI to persist Bearer token
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true, // Keep the token stored across refreshes
    },
    customJs: '/swagger-custom.js', // Path to your custom script
  };

  // Setup Swagger module to serve the documentation at '/api/docs'
  SwaggerModule.setup('docs', app, document, customOptions); // Updated to include /api prefix

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that are not defined in DTOs
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  }));

  // Start the application
  await app.listen(4000);
}

bootstrap();
