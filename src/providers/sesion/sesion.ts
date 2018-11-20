import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { Session } from '../../class/Session';
import { Message } from '../../class/Message';
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
  msgsRF = firebase.database().ref('msgs');
  constructor() {
    console.log('Hello SesionProvider Provider');
  }

  persist(session: Session) {
    return new Promise((resolve, reject) => {
      console.log('creando session')
      session.persist(this.sessionRF)
        .then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err)
        });

    });
  }

  getSessionsByIdUser(user: User) {
    let aux = [];
    return new Promise((resolve, reject) => {
      this.sessionRF.on('value', snap => {
        snap.forEach(element => {
          if (element.val().id_user1 == user.getId() || element.val().id_user2 == user.getId()) {
            let el = element.val();
            let session = new Session(el.id, el.id_user1, el.username_user1, el.id_user2, el.username_user2, el.last_msg);
            let msg = new Message(el.last_msg);
            msg.completeMe(this.msgsRF);
            session.setLast_Msg(msg);
            aux.unshift(session);
          }
        });
        resolve(aux);
      },error => {
        reject(aux);
      });
    });
  }

}
