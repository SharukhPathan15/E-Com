import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../Error-handler/ApplicationError.js";
import mongoose, { Error } from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const productModel=mongoose.model("product",productSchema);
const reviewModel=mongoose.model("review",reviewSchema);
const categoryModel=mongoose.model("Category",categorySchema);

class ProductRepository{
    constructor(){
        this.collection="products";
    }
    async add(productData){
        try{
            //1-Add the product
            console.log(productData);
            productData.categories=productData.category.split(',').map(e=>e.trim());
            const newProduct=new productModel(productData);
            const savedProduct=await newProduct.save();
            console.log(savedProduct);

            //2-Update the categories
            await categoryModel.updateMany(
                {_id:{$in:productData.categories}},
                {
                    $push:{products:new ObjectId(savedProduct._id)}
                }
            )
            
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
    }
    async getAll(){
        try{
             const db=getDB();
             const collection=db.collection(this.collection);
             const products=await collection.find().toArray();
             console.log(products);
            return products;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }

    }
    async get(id){
         try{
              const db=getDB();
              const collection=db.collection(this.collection);
              return await collection.findOne({_id:new ObjectId(id)});
         }
         catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
         }
    }
    async filter(minPrice,categories){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price={$gte: parseFloat(minPrice)}
            }   
            //['Cat1','Cat2']
            categories = JSON.parse(categories.replace(/'/g, '"'));
            console.log(categories);
            if(categories){
                filterExpression={$or:[{category:{$in:categories}},filterExpression]}
                // filterExpression.category=category
            }
            return collection.find(filterExpression).project({name:1,price:1}).toArray();
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
         }
    }
    // async rate(userId,ProductId,rating){
    //     try{
    //        const db=getDB();
    //        const collection=db.collection(this.collection);
    //        //find the product
    //        const product=await collection.findOne({_id:new ObjectId(ProductId)});
    //        //find the rating
    //        const userRating=product?.ratings?.find(r=>r.userId==userId);
    //        if(userRating){
    //            //update the rating
    //            await collection.updateOne({
    //               _id:new ObjectId(ProductId),"ratings.userId":new ObjectId(userId)
    //            },{
    //                $set:{
    //                 "ratings.$.rating":rating
    //                }
    //            })
    //        }
    //        else{
    //            await collection.updateOne({
    //                _id:new ObjectId(ProductId)
    //             },{
    //              $push:{ratings:{userId:new ObjectId(userId),rating}}
    //             })
    //        }
           
    //     }
    //      catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong",500);
    //      }
        
    // }
    async rate(userId,ProductId,rating){
        try{
            //1.check if product exists
            const productToUpdate=await productModel.findById(ProductId);
            if(!productToUpdate){
                throw new Error("Product not found")
            }
            
            //find the existing review
            const userReview=await reviewModel.findOne({product:new ObjectId(ProductId),user:new ObjectId(userId)});
            if(userReview){
                userReview.rating=rating;
                await userReview.save();
            }else{
                const newReview=new reviewModel({
                    product:new ObjectId(ProductId),
                    user:new ObjectId(userId),
                    rating:rating
                });
                newReview.save();
            }
        }
         catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
         }
        
    }
    async averageProductPricePerCategory(){
        try{
            const db=getDB();
            return await db.collection(this.collection)
                   .aggregate([
                     {
                        //step1:get average price per category
                        $group:{
                            _id:"$category",
                            averagePrice:{$avg:"$price"}
                        }
                     }
                   ]).toArray();


        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
         }
    }

}

export default ProductRepository;