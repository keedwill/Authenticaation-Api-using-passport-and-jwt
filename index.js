const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { DB, PORT } = require("./config/index");
const { success, error } = require("consola");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");

const swaggerOpts = {
  swaggerDefinition: {
    info: {
     title: 'Api Authentication with Passport and jwt',
     description: 'role and permission based api',
     contact :{
       name:'Princewill Owoh'
     },
     servers:["http://localhost:3000"]
    },
  },
  apis:['.routes/users.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOpts)

// INIT THE APP
const app = express();

app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs))

//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

//pass passport as an argument to the middleware
require("./middlewares/passport")(passport);

//user router middleware
app.use("/api/users", require("./routes/users"));

// connect to database
startApp = async () => {
  try {
    await mongoose.connect(DB, {
      useUnifiedTopology: true,
      useFindAndModify: true,
      useNewUrlParser: true,
    });
    success({ message: `Succesfully connected to  \n${DB}`, badge: true });
    app.listen(PORT, () =>
      success({ message: `Sever started on port ${PORT}`, badge: true })
    );
  } catch (err) {
    error({ message: `Unable to connect with database ${err}`, badge: true });
    startApp();
  }
};
startApp();
