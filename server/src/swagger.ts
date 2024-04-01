const dotenv = require('dotenv');
dotenv.config();

/* Swagger configuration */
const options = {
  openapi: 'OpenAPI 3', // Enable/Disable OpenAPI. By default is null
  language: 'en-US', // Change response language. By default is 'en-US'
  disableLogs: false, // Enable/Disable logs. By default is false
  autoHeaders: false, // Enable/Disable automatic headers capture. By default is true
  autoQuery: false, // Enable/Disable automatic query capture. By default is true
  autoBody: false, // Enable/Disable automatic body capture. By default is true
};

const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const { BASE_URL, VERSION } = process.env;

const doc = {
  info: {
    version: '2.0.0',
    description: 'API for Managing article CRUD operations',
    contact: {
      name: 'API Support',
      email: 'gutrfknc@gmail.com@gmail.com',
    },
  },
  host: 'localhost:8000',
  basePath: `/${BASE_URL}/${VERSION}`, // by default: '/'
  schemes: ['http'], // by default: ['http']
  consumes: ['application/json'], // by default: ['application/json']
  produces: ['application/json'], // by default: ['application/json']
  tags: [],
  components: {
    schemas: {
      AuthForm: {
        $username: 'John Doe',
        $password: 'password',
      },
      ArticleUpdateForm: {
        title: 'Hello World',
        link: 'https://abcnews.go.com/US/wireStory/settlement-reached-lawsuit-florida-gov-ron-desantis-disney-108547707',
        pubDate: '',
      },
      ArticleForm: {
        $title: 'Hello World',
        $link:
          'https://abcnews.go.com/US/wireStory/settlement-reached-lawsuit-florida-gov-ron-desantis-disney-108547707',
        pubDate: '',
      },
    },
    '@schemas': {
      User: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
            description: 'Username to login',
          },
          hashedPassword: {
            type: 'string',
            description: 'Hashed password',
          },
        },
      },
      Article: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Article title',
          },
          link: {
            type: 'string',
            format: 'uri',
            minLength: 1,
            pattern:
              '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
            description: 'Article URL',
          },
          pubDate: {
            type: 'string',
            format: 'date',
            description: 'Published article date',
          },
        },
      },
      ArticleArray: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Article',
        },
      },
      AuthForm: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
            description: 'Username to login',
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 3,
            maxLength: 20,
            description: 'Password to login',
          },
        },
        required: ['username', 'password'],
      },
      ArticleUpdateForm: {
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Article title',
          },
          link: {
            type: 'string',
            format: 'uri',
            minLength: 1,
            pattern:
              '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
            description: 'Article URL',
          },
          pubDate: {
            type: 'string',
            format: 'date',
            description: 'Published article date',
          },
        },
      },
      ArticleForm: {
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Article title',
          },
          link: {
            type: 'string',
            format: 'uri',
            minLength: 1,
            pattern:
              '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
            description: 'Article URL',
          },
          pubDate: {
            type: 'string',
            format: 'date',
            description: 'Published article date',
          },
        },
        required: ['title', 'link'],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const outputFile = './docs/swagger.json';
const endpointsFiles = [
  './routes/index.routes.ts',
  './controllers/*.controller.ts',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
