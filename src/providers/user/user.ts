import { Injectable } from '@angular/core';


import { FireAuthProvider } from  '../../providers/fire-auth/fire-auth';

import { User  } from '../../class/User';
import * as firebase from 'firebase/app';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class UserProvider {
  user: User = User.prototype;
  firebase =  firebase;
  userRF = firebase.database().ref('users');
  constructor(private _FireAuth: FireAuthProvider) {
    console.log('Hello UserProvider Provider');
  }

  persist(user){
    return this._FireAuth.registerByEmaiAndPassword(user);
  }

  getUserByCredentials(user){
    return this._FireAuth.login(user);
  }

  getUserById(id_user){
    return this.user.getUserById(this.userRF,id_user);
  }

  getUsersBySearching(search,who_search){
    return this.user.getUsersBySearching(this.userRF,search,who_search);
  }

  addContact(new_contact,to){
    return this.user.addContact(this.userRF,new_contact,to);
  }

}
