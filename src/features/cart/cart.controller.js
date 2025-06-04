import cartItemModel from "./cart.model.js";
import cartRepository from "./cart.repository.js";
export class cartItemController{
    constructor(){
        this.cartRepository=new cartRepository();
    }
    async add(req,res){
        try{
           const {productId,quantity}=req.body;
           const userId=req.userID;
           await this.cartRepository.add(productId,userId,quantity);
           res.status(201).send("Cart is updated");
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
        
    }
    async get(req,res){
        try{
           const userId=req.userID;
           const items=await this.cartRepository.get(userId);
           return res.status(201).send(items);
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
        
    }
    async delete(req,res){
        try{
            const userId=req.userID;
            const cartItemId=req.params.id;
            const isDeleted=await this.cartRepository.delete(userId,cartItemId);
            if(!isDeleted){
                 return res.status(404).send("item not found");
            }return res.status(200).send("cart item is removed");
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
    }
}