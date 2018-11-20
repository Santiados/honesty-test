import { Injectable } from '@angular/core';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  
*/
import * as firebase from 'firebase';

import { Message } from '../../class/Message';
@Injectable()
export class MessageProvider {

  firebase = firebase;
  msgRF = this.firebase.database().ref('msgs');
  constructor() {
    console.log('Hello MessageProvider Provider');
  }


  persist(msg:Message) {
    return new Promise((resolve, reject) => {
      msg.persist(this.msgRF)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err);
      });
    });
  }

}
