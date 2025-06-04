import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import orderModel from "./order.model.js";

export default class orderRepository{
    constructor(){
        this.collection="orders";
    }

    async placeOrder(userId){
        const client=getClient();
        const session=client.startSession();
        try{
        const client=getClient();
        const session=client.startSession();
        const db=getDB();
        session.startTransaction();
        //1-get cart item and calculate total amount
        const items=await this.getTotalAmount(userId,session);
        const totalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0)
        console.log(totalAmount);
        //2-create order record
        const newOrder=new orderModel(new ObjectId(userId),totalAmount,new Date());
        await db.collection(this.collection).insertOne(newOrder,{session});

        //3-Reduce the stock
        for(let item of items){
            await db.collection("products").updateOne(
                {_id:item.productId},
                {$inc:{stock:-item.quantity}},{session}
            )
        }

        // throw new Error("Something is wrong in placeorder");
        //4-clear cart item
        await db.collection("cart").deleteMany({
            userId:new ObjectId(userId)
        },{session});
        session.commitTransaction();
        session.endSession();
        return;


        }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
    }
    async getTotalAmount(userId,session){
        const db=getDB();
        const items=await db.collection("cart").aggregate([
            //1-get cart item for the user
            {
                $match:{userId:new ObjectId(userId)}
            },
            //2- get the product from products collection
            {
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"_id",
                    as:"productInfo"
                }
            },
            //3-Unwind the productInfo
            {
                $unwind:"$productInfo"
            },
            //4-calculate total amount for each cartitems
            {
                $addFields:{
                    "totalAmount":{
                        $multiply:["$productInfo.price","$quantity"]
                    }
                }
            }
        ],{session}).toArray();
        return items;

    }
}