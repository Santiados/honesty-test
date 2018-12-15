import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Content, PopoverController, FabContainer, ModalController, AlertController } from 'ionic-angular';

import { SesionProvider } from '../../providers/sesion/sesion';
import { UserProvider } from '../../providers/user/user';
import { MessageProvider } from '../../providers/message/message';

import { ContactsPage } from '../../pages/contacts/contacts';
import { ChatPage } from '../../pages/chat/chat';
import { PopOverPage } from '../../pages/pop-over/pop-over';
import { AddContactPage } from '../../pages/add-contact/add-contact';

import { Session } from '../../class/Session';
import { User } from '../../class/User';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProfilePage } from '../profile/profile';
import { TranslateService } from '@ngx-translate/core';

import * as firebase from 'firebase/app'

import { BarcodeScanner, BarcodeScanResult, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  user: User;
  _SESSIONS = [];
  foundUser: User = null;
  usersRF = firebase.database().ref('users');
  constructor(
    public navCtrl: NavController,
    private paramCtrl: NavParams,
    private alertCtrl: AlertController,
    private toasCtrl: ToastController,
    private popCtrl: PopoverController,
    private modalCtrl: ModalController,
    private sessionService: SesionProvider,
    private userService: UserProvider,
    private msgService: MessageProvider,
    private db: AngularFireDatabase,
    private translate: TranslateService,
    private barcode: BarcodeScanner
  ) {
    this.user = this.paramCtrl.data.data;
    this.db.object('sessions').valueChanges().subscribe(ses => {
      this._SESSIONS = [];
      for (let d in ses) {
        if (ses[d].id_user1 == this.user.getId() || ses[d].id_user2 == this.user.getId()) {
          let fecha_ult_msg = (new Date(ses[d].last_msg_time).getHours()) + ':' + ((new Date(ses[d].last_msg_time).getMinutes() < 10) ? '0' + new Date(ses[d].last_msg_time).getMinutes() : new Date(ses[d].last_msg_time).getMinutes());
          let session = new Session(ses[d].id, ses[d].id_user1, ses[d].username_user1, ses[d].id_user2, ses[d].username_user2, ses[d].last_msg, fecha_ult_msg, ses[d].user_out, ses[d].sessionOpen, ses[d].creation);
          this._SESSIONS.push(session);
        }
      }
      setTimeout(() => {
        if (this.content._scroll) {
          this.content.scrollToBottom(200);
        }
      }, 500);
    });
  }

  ionViewDidLoad(){
  }


  showProfile(user: User) {
    let modal = this.modalCtrl.create(ProfilePage, {
      user: this.user
    });
    modal.present();
  }

  getMyContacts() {
    this.navCtrl.push(ContactsPage, {
      user: this.user
    });
  }

  getMySessions() {
    this.sessionService.getSessionsByIdUser(this.user.getId())
      .then((result: any) => {
        this._SESSIONS = result;
      }).catch((err) => {
        this.showNot(err.message);
      });
  }

  goSession(session: Session) {
    var id_contact = this.user.getId() == session.id_user1 ? session.id_user2 : session.id_user1;
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




  fabBut(fb: FabContainer) {
    setTimeout(() => {
      fb.close();
    }, 3000);
  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

  addContact() {
    let contact = this.modalCtrl.create(AddContactPage, {
      user: this.user
    });
    contact.onDidDismiss(data => {
      console.log(data)
    });
    contact.present();
  }

  scanQR() {
    this.barcode.scan()
      .then((data: BarcodeScanResult) => {
        console.log(data.format);
        if (data.format == 'QR_CODE') {
          this.db.database.ref('users').child(data.text).once('value', (u:any) => {
            if (u) {
              let d = u.val();
              this.foundUser = new User(d.id, d.username, d.email, d.state, d.theme, d.deleted, d.creation);
              setTimeout(() => {
                this.showAlert(this.foundUser);
              }, 500);
            } else {
              this.showNot(this.trans('errors.codigousernoencontrado'));
            }
          });
        } else {
          this.showNot(this.trans('errors.codigonoadmitido'));
        }
      }).catch((err) => {
        this.showNot(JSON.stringify(err));
      });
  }

  showAlert(contact: User) {
    let alert = this.alertCtrl.create({
      title: this.trans('homepage.userfound'),
      cssClass: 'alertUser2',
      message: contact.getUsername(),
      buttons: [
        {
          text: this.trans('homepage.chat'),
          cssClass: 'chat-but',
          handler: () => {
            this.createChatRoom(this.user, contact);
          }
        },
        {
          text: this.trans('homepage.aniadir'),
          cssClass: 'add-but',
          handler: () => {
            this.userService.addContact(contact, this.user)
              .then((result) => {
                this.showNot(contact.getUsername() + this.trans('addcontactpage.useradd'));
              })
              .catch((err => {
                console.log(JSON.stringify(err));
                this.showNot(this.trans('errors.' + err.message));
              }));
          }
        }
      ]
    });

    alert.present();
  }

  createChatRoom(user: User, contact: User) {
    this.sessionService.getSessionByUsers(user.getId(), contact.getId())
      .then((resultSession: Session[]) => {
        this.userService.getUserById(contact.getId())
          .then((resultUser: User) => {
            this.navCtrl.push(ChatPage, {
              user: user,
              contact: resultUser,
              session: (resultSession.length > 0) ? resultSession[0] : null
            });
          });
      }).catch((err) => {
        this.showNot(err.message);
      });
  }

  trans(msg) {
    let re = '';
    this.translate.get(msg).subscribe(
      value => {
        re = value;
      }
    );
    return re;
  }

}

