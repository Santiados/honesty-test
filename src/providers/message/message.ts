import { Injectable } from '@angular/core';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  
*/
import * as firebase from 'firebase/app';

import { Message } from '../../class/Message';
@Injectable()
export class MessageProvider {
  msg: Message = Message.prototype;
  firebase = firebase;
  msgRF = this.firebase.database().ref('msgs');
  constructor() {
    console.log('Hello MessageProvider Provider');
  }


  persist(msg:Message) {
    return msg.persist(this.msgRF);
  }

  getMessagesByIdSession(id_session){
    return this.msg.getMessagesByIdSession(this.msgRF,id_session);
  }

}
