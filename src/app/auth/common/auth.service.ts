import { User } from './user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { AuthResponse } from './authResponse.model';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigClass } from 'src/app/common/config.service';

@Injectable({
    providedIn: 'root'
  })
export class AuthService{  
    userStatusChanged = new Subject<{loggedin:any,isadmin:any}>();
    header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    constructor(private httpClient: HttpClient) { }

    signupUser(user:User){
        var userdata = 'name=' + user.name + '&phone=' + user.phone + '&email=' + user.email
                + '&password=' + user.password + '&role=' + user.role;

        return this.httpClient.post(ConfigClass.restAPIURL + 'user', userdata, { headers:this.header })
        .pipe(tap((res)=>{
          if(!res['success']){
            return new AuthResponse({
                result: false,
                message: res['message']
            });
          } else{
            localStorage.setItem('token',  res['token']);
            this.userStatusChanged.next({loggedin: this.returnValue(localStorage.getItem('token')), isadmin: this.returnValue(localStorage.getItem('isadmin'))});
            return new AuthResponse({
                result: true,
                message: res['message']
            });
          }
        }));
    }

    signinUser(email:string, password:string):Observable<any>{
        var creds = 'email=' + email + '&password=' + password;
    
        return this.httpClient.post(ConfigClass.restAPIURL + 'authenticate' , creds,{ headers:this.header })
        .pipe(tap((res)=>{
        //   console.log(res);
          if(!res['success']){
            return new AuthResponse({
                result: false,
                message: res['message']
            });
          } else{
            localStorage.setItem('token',  res['token']);
            // console.log(localStorage.getItem('token'));
            localStorage.setItem('isadmin', res['user'].admin);
            // console.log('token');
            // this.userStatusChanged.next(localStorage.getItem('token'));
            this.userStatusChanged.next({loggedin: localStorage.getItem('token'), isadmin: localStorage.getItem('isadmin')});

            return new AuthResponse({
                result: true,
                message: res['message'],
                user:res['user']
            });
          }
        }));
    }

    returnValue(val):boolean{
        return (val === null?false:val);
    }

    onLogout(){
        localStorage.removeItem('token');
        localStorage.removeItem('isadmin');
        this.userStatusChanged.next({loggedin: null, isadmin: null});
    }

    checklogin(){
      this.userStatusChanged.next({loggedin: localStorage.getItem('token'), isadmin: localStorage.getItem('isadmin')});
    }
    
    // getUsers(){
    //     return this.httpClient.get(this.BaseUrl + 'api/users?token=' + localStorage.getItem('token'));
    // }
}