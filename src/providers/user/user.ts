import { Injectable } from '@angular/core';


import { FireAuthProvider } from  '../../providers/fire-auth/fire-auth';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class UserProvider {
  constructor(private _FireAuth: FireAuthProvider) {
    console.log('Hello UserProvider Provider');
  }

  persist(user){
    return new Promise((resolve,reject)=>{
      this._FireAuth.registerByEmaiAndPassword(user)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    })
  }

  getUserByCredentials(user){
    return new Promise((resolve,reject) => {
      this._FireAuth.login(user)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

}
