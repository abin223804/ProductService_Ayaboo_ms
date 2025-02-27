

import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import mediaRoute from './routes/mediaRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import brandRoute from './routes/brandRoute.js';
import productRoute from './routes/productRoute.js';
import connectDB from "./config/db.js";


const app = express();

const corsOptions = {
  // origin: ["http://localhost:5175", "http://localhost:5173"], 
  origin: ["https://admin.ayaboo.com", "https://store.ayaboo.com","https://ayaboo.com"], 

  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/media", mediaRoute);
app.use("/category", categoryRoute);
app.use("/brand", brandRoute);
app.use("/product", productRoute);


app.listen(process.env.PORT, () => {
  console.log(chalk.bgHex('#00ff00')(`Product Service running on port ${process.env.PORT}`));
});


connectDB();