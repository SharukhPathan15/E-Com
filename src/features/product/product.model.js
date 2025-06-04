import { ApplicationError } from "../../Error-handler/ApplicationError.js";
import { userModel } from "../user/user.model.js";
export default class ProductModel{
    constructor( name, desc, price, imageUrl, category, sizes,categories,id){
        this._id=id;
        this.name=name;
        this.desc=desc;
        this.imageUrl=imageUrl;
        this.category=category;
        this.price=price;
        this.sizes=sizes;
        this.categories=categories;
    }
    static add(product){
      product.id=products.length+1;
      products.push(product);
      return product;
    }

    static get(id){
      const product=products.find(i=>i.id==id);
      return product;
    }
    static getAll(){
        return products;
    }
    static filter(minPrice, maxPrice, category){
      const result = products.filter((product)=>{
        return(
        (!minPrice || 
          product.price >= minPrice) &&
        (!maxPrice || 
          product.price <= maxPrice) &&
        (!category || 
          product.category == category)
        );
      });
      return result;
    }
    static rateProduct(userId,ProductId,rating){
      // 1 validate user and product
      const user=userModel.getAll().find(
        (u)=>u.id==userId
      );
      if(!user){
        throw new ApplicationError("User not found",404);
      }

      //validate product
      const product=products.find(p=>p.id==ProductId);
      if(!product){
        throw new ApplicationError("Product not found",400);
      }

      //2- check if there is rating and if not then add rating array
      if(!product.ratings){
        product.ratings=[];
        product.ratings.push({
          userId:userId,rating:rating
        });
      }else{
        // 3 check if user rating already available
        const existingRatingIndex=product.ratings.findIndex(
          (r)=>r.userId==userId
        );
        if(existingRatingIndex>=0){
          product.ratings[existingRatingIndex]={
            userId:userId,
            rating:rating
          }
        }else{
          // 4 if not exsisting then add new rating
          product.ratings.push({
            userId:userId,rating:rating
          });
        }

      }
    }


    
} 

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Category1'
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Category2',
      ['M', 'XL']
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Category3',
      ['M', 'XL','S']
    )];