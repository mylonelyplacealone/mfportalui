export class AuthResponse{
    public result: boolean;
    public message:string;
    public data:any;
    
    constructor(data){
        this.result  = data.result;
        this.message  = data.message;
        this.data  = data.data;
    }
}