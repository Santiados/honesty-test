import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { SesionProvider } from '../../providers/sesion/sesion';
import { UserProvider } from '../../providers/user/user';
import { MessageProvider } from '../../providers/message/message';

import { ContactsPage } from '../../pages/contacts/contacts';
import { ChatPage } from '../../pages/chat/chat';

import { Session } from '../../class/Session';
import { User } from '../../class/User';
import { Message } from '../../class/Message';

import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User;
  _SESSIONS = [];
  sessionsRF = firebase.database().ref('sessions');
  constructor(
    public navCtrl: NavController,
    private paramCtrl: NavParams,
    private toasCtrl: ToastController,
    private sessionService: SesionProvider,
    private userService: UserProvider,
    private msgService: MessageProvider
  ) {
    this.user = this.paramCtrl.data.data;
    this.sessionsRF.on('value', snap => {
      this._SESSIONS = [];
      this._SESSIONS = snapshotToArray(this.user.id_user,snap);
    });
  }

  ionViewDidLoad() {
    console.log('hola');
  }
  ionViewCanEnter() {
    this.getMySessions();
  }

  getMyContacts() {
    this.navCtrl.push(ContactsPage, {
      user: this.user
    });
  }

  getMySessions() {
    this.sessionService.getSessionsByIdUser(this.user.id_user)
      .then((result: any) => {
        this._SESSIONS = result;
      }).catch((err) => {
        this.showNot(err.message);
      });
  }

  goSession(session: Session) {
    var id_contact = this.user.id_user == session.id_user1 ? session.id_user2 : session.id_user1;
    this.userService.getUserById(id_contact)
      .then((result: User) => {
        var contact: User;
        contact = result;

        this.navCtrl.push(ChatPage, {
          session: session,
          user: this.user,
          contact: contact
        });
      });


  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

}

export const snapshotToArray = (id_user,snapshot) => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    if (childSnapshot.val().id_user1 == id_user || childSnapshot.val().id_user2 == id_user) {
      let item = childSnapshot.val();
      returnArr.push(item);
    }
  });

  return returnArr;
};

