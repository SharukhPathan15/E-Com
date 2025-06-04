import "./env.js";
// 1. Import express
import express from 'express';
import swagger, { serve } from "swagger-ui-express";
import cors from 'cors';




import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';

import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cart.routes.js';
import apidoc from "./swagger.json" with { type: "json" };
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/Error-handler/ApplicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import likeRouter from "./src/features/like/like.router.js";
import { connectUsingMongoose } from "./config/mongooseconfig.js";
import mongoose from "mongoose";


// 2. Create Server
const server = express();

server.use(cors());

//cors policy configuration
// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers','*');
//     res.header('Access-Control-Allow-Methods','*')
//     //return ok for preflight request
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

server.use(express.json());
// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
server.use("/api-docs", swagger.serve,swagger.setup(apidoc));

server.use(loggerMiddleware);

server.use("/api/orders",jwtAuth,orderRouter);

server.use("/api/cartItem",jwtAuth,cartRouter);
server.use("/api/products",jwtAuth, productRouter);
server.use("/api/user",userRouter);
server.use("/api/likes",jwtAuth,likeRouter);

// 3. Default request handler
server.get('/', (req, res)=>{
    res.send("Welcome to Ecommerce APIs");
});

//Error handler middleware 
server.use((err,req,res,next)=>{
    console.log(err);

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }

    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    res.status(500).send("Something went wrong. please try later");
})

// 4. Middleware to handle 404 requests
server.use((req,res)=>{
    res.status(404).send("API not found");
})

// 5. Specify port.
server.listen(3200,()=>{
    console.log("Server is running at 3200");
    connectUsingMongoose();
});

