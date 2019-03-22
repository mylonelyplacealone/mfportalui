export class User{
    public userid: Number;
    public name: String;
    public phone:Number;
    public email:String;
    public password: String;
    public role: String;

    constructor(data){
        this.userid  = data.userid;
        this.name  = data.name;
        this.phone  = data.phone;
        this.email  = data.email;
        this.password =  data.password;
        this.role = data.role;
    }
}