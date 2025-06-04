import jwt from "jsonwebtoken";

const jwtAuth=(req,res,next)=>{
    //1 Read the token
    
    const token=req.headers["authorization"];


    //2 If no token return the error
    if(!token){
        return res.status(401).send("Unauthorized");
    }

    //3 Check if token is valid or not
    try{
        const payload=jwt.verify(
            token,
            'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz'
        );
        req.userID=payload.userID;
        console.log(payload);
    }
    //4 return error
    catch(err){
        //4 return error
        console.log(err)
        return res.status(401).send("Unauthorized");
    }

    //5 call next middleware
    next();

}

export default jwtAuth;