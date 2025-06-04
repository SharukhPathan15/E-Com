
export class userModel{

    constructor(name,email,password,type,id){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        this._id=id;
    }

    
    
    
    static getAll(){
        return users;
    }
}

let users=[
    {
        id:'1',
        name:'sellerUser',
        email:'user@123.com',
        password:'pass@1234',
        type:'seller'
    },
    {
        id:'2',
        name:'Customer User',
        email:'customer@123.com',
        password:'pass@1234',
        type:'Customer'
    },
];