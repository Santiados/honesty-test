import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { Session } from '../../class/Session';

import { User } from '../../class/User';

/*
  Generated class for the SesionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SesionProvider {
  firebase = firebase;
  sessionRF = firebase.database().ref('sessions');
  constructor() {
    console.log('Hello SesionProvider Provider');
  }

  persist(session: Session){
    return new Promise((resolve,reject)=>{
      console.log('creando session')
      session.persist(this.sessionRF)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err)
      });
      
    });
  }

  getSessionsByIdUser(user:User){
    let aux = [];
    console.log(user)
    this.sessionRF.on('value',snap =>{
      snap.forEach(element => {
        if(element.hasChild(user.id_user)){
          aux.push(element);
        }
      });
    });
    console.log('todo',aux)
  }

}
