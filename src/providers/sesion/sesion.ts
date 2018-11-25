import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
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
  session: Session = Session.prototype;
  firebase = firebase;
  sessionRF = firebase.database().ref('sessions');
  msgsRF = firebase.database().ref('msgs');
  constructor() {
    console.log('Hello SesionProvider Provider');
  }

  persist(session: Session) {
    return session.persist(this.sessionRF);
  }

  getSessionsByIdUser(id_user) {
    return this.session.getSessionsByIdUser(this.sessionRF,id_user);
  }

  getSessionByUsers(id_user1,id_user2){
    return this.session.getSessionByIdUsers(this.sessionRF,id_user1,id_user2);
  }

}
