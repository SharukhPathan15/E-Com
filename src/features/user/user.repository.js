import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../Error-handler/ApplicationError.js";

//creating model from schema
const userModel=mongoose.model("users",userSchema);


export default class userRepository{
    async signUp(user){
        //create instance of model
        try{
             //create instance of model
             const newUser=new userModel(user);
             await newUser.save();
             return newUser;
        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                console.log(err);
                throw new ApplicationError("Something went wrong",500);
            }
            
        }
    }
    async signIn(){
        try{
            return await userModel.findOne({email,password});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
    }
    async findByEmail(email){
        
                try{
                 return await userModel.findOne({email});
                }
                catch(err){
                    console.log(err);
                    throw new ApplicationError("Something went wrong",500);
                }
        }
    async resetPassword(userId,newPassword){
        try{
            let user=await userModel.findById(userId);
            if(user){
                user.password=newPassword;
                user.save();
            }else{
                throw new Error("User not found");
            }

        }catch(err){
                    console.log(err);
                    throw new ApplicationError("Something went wrong",500);
        }
    }
}