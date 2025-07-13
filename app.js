const express = require("express");
const app = express();

const errorMiddleWare = require("../backend/middleware/error.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
const {config} = require("dotenv");
config({path: "./config/config.env"});
//Route Import
const products = require("../backend/routes/productsRoute.js");
const Errorhandler = require("./utils/errorhandler.js");
const user = require("../backend/routes/userRoutes.js");
const payment = require("../backend/routes/paymentRoutes.js");
const order = require('../backend/routes/orderRoutes.js')
const cart = require("../backend/routes/cartRoutes.js")
app.use(cookieParser());


app.use("/api/v1",products);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);
app.use("/api/v1",cart)


app.use(errorMiddleWare);


module.exports = app;



