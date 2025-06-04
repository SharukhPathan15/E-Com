import orderRepository from "./order.repository.js";



export default class orderController{
    constructor(){
        this.orderRepository=new orderRepository();
    }
    async placeOrder(req,res,next){
        try{
            const userId=req.userID;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is created");

        }
        catch(err){
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
    }
}