const express = require("express");
const app = express();

const errorMiddleWare = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [
        "meddybuddy-ecommerce-mavz-1q8hzdvml-rishanth-reddys-projects.vercel.app"
    ],
    credentials: true
}));



const { config } = require("dotenv");
config({ path: "./config/config.env" });

// Route Imports
const products = require("./routes/productsRoute.js");
const Errorhandler = require("./utils/errorhandler.js");
const user = require("./routes/userRoutes.js");
const payment = require("./routes/paymentRoutes.js");
const order = require("./routes/orderRoutes.js");
const cart = require("./routes/cartRoutes.js");

app.use(cookieParser());

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", cart);

app.use(errorMiddleWare);

module.exports = app;
