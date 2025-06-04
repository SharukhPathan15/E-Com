// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

// All the paths to the controller methods.
// localhost/api/products 
userRouter.post('/SignUp',(req,res,next)=>{
    userController.signUp(req,res,next);
});
userRouter.post('/SignIn',(req,res,next)=>{
    userController.signIn(req,res,next);
});
userRouter.put('/resetPass', jwtAuth,  (req,res)=>{
    userController.resetPassword(req,res)
})


export default userRouter;