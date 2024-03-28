import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.config';
import articleRouter from './routes/article.routes';
import authRouter from './routes/auth.routes';
import parse from './helpers/parser';

dotenv.config();

const { MONGO_USERNAME, MONGO_PASSWORD, RSS_URL, BASE_URL, VERSION } =
  process.env;

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.31fc5ax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 8000;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`/${BASE_URL}/${VERSION}/articles`, articleRouter);
app.use(`/${BASE_URL}/${VERSION}/auth`, authRouter);

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
