const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const user = require("./routes/user.js"); 

const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Taskar.io Node.js server',
    version: '0.0.1',
    description: "Сервер для приложения Taskar.io написанный на Node.js и Express",
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ]
  }
};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);


InitiateMongoServer();

const app = express();

const PORT = process.env.PORT || 3000;

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ endpoints: ["/user", "/docs"] }); 
});

app.use("/user", user);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
