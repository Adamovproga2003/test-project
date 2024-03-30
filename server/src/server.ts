import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.config';
import cors from 'cors';
import morgan from 'morgan';
import parse from './helpers/parser';
import appRoutes from './routes/index.routes';
import cookieParser from 'cookie-parser';
dotenv.config();

const { MONGO_USERNAME, MONGO_PASSWORD, RSS_URL, BASE_URL, VERSION } =
  process.env;

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.31fc5ax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 8000;
const SERVER_URL = `/${BASE_URL}/${VERSION}`;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);

var corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(`${SERVER_URL}`, appRoutes);

const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    console.log('Mongodb is connected!!!');

    parse(RSS_URL || '');

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

// OpenAPI UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
