import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express";

import connectDB from './utils/mongo.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from './middlewares/errorHandler.js';
import customErrorHandler from './middlewares/customErrorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'AdoptPets API',
            version: '1.0.0',
            description: 'API para sistema de adopcion de mascotas'
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'coderCookie'
                }
            }
        }
    },
    apis: [
        './src/docs/**/*.yaml',
        './src/routes/*.js'
    ]
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Middleware de manejo de errores
app.use(errorHandler);
app.use(customErrorHandler);

app.listen(PORT, () => console.log(`Corriendo en el puerto: ${PORT}`));