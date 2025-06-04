
import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";
//load all environment variable in application
dotenv.config();

const url=process.env.DB_URL;

export const connectUsingMongoose=async()=>{
   
    try{
        await mongoose.connect(url);
        console.log("MongoDB using mongoose is connected");
        addCategories();
        
    }
    catch(err){
        console.log(err)
    }
}

async function addCategories(){
    const categoryModel=mongoose.model('Category',categorySchema);
    const categories=await categoryModel.find();
    if(!categories||categories.length==0){
        await categoryModel.insertMany([{name:'Books'},{name:'Clothing'},{name:'Electronics'}]);
    }
    console.log("Categories are added");
}
