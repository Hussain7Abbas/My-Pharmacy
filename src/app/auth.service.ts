import { Injectable } from '@angular/core';
// import { apiKey } from "../../app/api/apiConfig.js";
// import { Http , Headers } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // createAccount(details){
  //   return new Promise((resolve, reject) => {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');

  //     this.http.post(apiKey + 'api/auth/register', JSON.stringify(details), {headers: headers})
  //       .subscribe(res => {
  //         let data = res.json();
  //         localStorage.setItem('userData', JSON.stringify(data.user));
  //         localStorage.setItem('token', data.token);
  //         console.log(data);

  //         resolve(data);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  // login(credentials){
  //   return new Promise((resolve, reject) => {
  //     let headers = new Headers();
  //     // headers.append('Content-Type', 'application/json');
  //     headers.append('Access-Control-Allow-Origin' , '*');
  //     headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  //     headers.append('Accept','application/json');
  //     headers.append('content-type','application/json');

  //     console.log(JSON.stringify(credentials));
  //     this.http.post(apiKey + 'api/auth/login', JSON.stringify(credentials), {headers: headers})
  //     .subscribe(res => {
  //       let data = res.json();
  //       localStorage.setItem('userData', JSON.stringify(data.user));
  //       localStorage.setItem('token', data.token);
  //       console.log(data);
  //       resolve(data);
  //     }, (err) => {
  //       reject(err);
  //     });
  //   });

  // }

  // getMe(){
  //   return new Promise((resolve, reject) => {
  //     let headers = new Headers();
  //     // headers.append('Content-Type', 'application/json');
  //     headers.append('Access-Control-Allow-Origin' , '*');
  //     headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  //     headers.append('Accept','application/json');
  //     headers.append('content-type','application/json');

  //     this.http.get(apiKey + 'api/auth/users/me', {headers: headers})
  //     .subscribe(res => {
  //       let data = res.json();
  //       console.log(data);
  //       resolve(data);
  //     }, (err) => {
  //       reject(err);
  //     });
  //   });
  // }


  // checkAuthentication(){
  //   return new Promise((resolve, reject) => {
  //       let token = localStorage.getItem('token');
  //       if (token == null || token == 'undefined' || token == ""){
  //         reject("No Token: " + token)
  //       }else{
  //         resolve(token)
  //       }
  //   });
  // }


  // logout(){
  //   localStorage.setItem('token', "");
  // }

}
