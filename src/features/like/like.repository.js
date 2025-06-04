import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";


const likeModel=mongoose.model('like',likeSchema);

export class LikeRepository{

    async getLikes(type,id){
        return await likeModel.find({
            likeable: new ObjectId(id),
            types:type
        }).populate('user').populate({path:'likeable',model:type})
    }

    async likeProduct(userId,productId){
        try{
            const newLike=new likeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(productId),
                types:'product'
            });
            await newLike.save();

        }catch(err){
                    console.log(err);
                    throw new ApplicationError("Something went wrong",500);
        }
    }
    async likeCategory(userId,categoryId){
        try{
            const newLike=new likeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(categoryId),
                types:'category'
            });
            await newLike.save();

        }catch(err){
                    console.log(err);
                    throw new ApplicationError("Something went wrong",500);
        }
    }
}