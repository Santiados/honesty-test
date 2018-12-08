import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User  } from '../../class/User';
import { UserProvider } from '../user/user';

/*
  Generated class for the FireAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireAuthProvider {

  auxMailer = '@honesty.dev';
  db = firebase;
  usuariosRF = this.db.database().ref('users');
  constructor(private _FIRE: AngularFireAuth) {
    console.log('Hello FireAuthProvider Provider');
  }


  registerByEmaiAndPassword(user:any){
    let email = user.username + this.auxMailer;
    return new Promise((resolve,reject)=>{
      this._FIRE.auth.createUserWithEmailAndPassword(email,user.password)
      .then((result) => {
        let current_user = this.db.auth().currentUser;
        current_user.updateProfile({
          displayName: user.username,
          photoURL: ''
        });
        let id_created_user = current_user.uid;
        let new_user = new User(id_created_user,user.username,current_user.email,user.state);
        new_user.persist(this.usuariosRF);
        resolve(new_user);
      }).catch((err) => {
        reject(err);
      });
    })
  }

  login(user){
    let email = user.username + this.auxMailer;
    return new Promise((resolve,reject)=>{
      this._FIRE.auth.signInWithEmailAndPassword(email,user.password)
      .then((result) => {
        let current_user = this.db.auth().currentUser;
        this.usuariosRF.child(current_user.uid).on('value', data =>{
          let q = data.val();
          let user = new User(q.id,q.username,q.email,q.state,q.theme,q.deleted,q.creation);
          if(!user.getDeleted()){
            resolve(user);
          }else {
            let error = {
              message: 'Esta cuenta ha sido marcada como eliminada, debe contactar con el servicio técnico para recuperarla',
              type: 1
            };
            reject(error);
          }
        });
      }).catch((err) => {
        reject(err)
      });
    });
  }

}
