
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController{
    constructor(){
        this.productRepository=new ProductRepository();
    }

    async getAllProducts(req,res){
        try{
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        }
        catch(err){
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
    }

    async addProduct(req, res){
        try{
            console.log(req.body);
            const {name,price,sizes,categories}=req.body;
            const imageFileName=req.file?.filename || null;
            const categoryString=categories || '';
            const categoreArray=categories? categories.split(','):[];
            const newProduct=new ProductModel(name,null,parseFloat(price),imageFileName,categoryString,sizes?sizes.split(','):[],categoreArray);
            const createProduct=await this.productRepository.add(newProduct);
            res.status(201).send(createProduct);
        }
        catch(err){
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
        
        
    }

    async rateProduct(req,res,next){
        try{
            const userId=req.userID;
            const ProductId=req.body.productId;
            const rating=req.body.rating;
            console.log(rating);
            console.log(userId);
            console.log(ProductId);
            await this.productRepository.rate(userId,ProductId,rating);

            
            return res.status(200).send("Rating has been added");
        }catch(err){
            console.log("passing error to middleware");
            next(err);
        }
    }
    

    async getOneProduct(req,res){
        try{
            const id=req.params.id;
            const products =await this.productRepository.get(id);
            if(!products){
            res.status(404).send("Product not found");
            }
              else{
                   return res.status(200).send(products);
            }
        }
        catch(err){
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
    }
    async filterProducts(req,res){
        try{
           const minPrice = req.query.minPrice;
           const maxPrice = req.query.maxPrice;
           const categories = req.query.categories;
           const result =await this.productRepository.filter(
            minPrice,
            categories
        );
        res.status(200).send(result);
        }
        catch(err){
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
        
    }
    async averagePrice(req,res,next){
        try{
            const result=await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);

        }catch(err){
            console.log(err);
            return res.status(404).send("Something went wrong");
        }
    }

}