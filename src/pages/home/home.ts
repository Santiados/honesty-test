import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Content, PopoverController, FabContainer, ModalController } from 'ionic-angular';

import { SesionProvider } from '../../providers/sesion/sesion';
import { UserProvider } from '../../providers/user/user';
import { MessageProvider } from '../../providers/message/message';

import { ContactsPage } from '../../pages/contacts/contacts';
import { ChatPage } from '../../pages/chat/chat';
import { PopOverPage } from '../../pages/pop-over/pop-over';
import { AddContactPage } from '../../pages/add-contact/add-contact';

import { Session } from '../../class/Session';
import { User } from '../../class/User';
import { Message } from '../../class/Message';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  user: User;
  _SESSIONS = [];
  sessionsRF = firebase.database().ref('sessions');
  constructor(
    public navCtrl: NavController,
    private paramCtrl: NavParams,
    private toasCtrl: ToastController,
    private popCtrl: PopoverController,
    private modalCtrl: ModalController,
    private sessionService: SesionProvider,
    private userService: UserProvider,
    private msgService: MessageProvider,
    private db: AngularFireDatabase
  ) {
    this.user = this.paramCtrl.data.data;
    this.db.object('sessions').valueChanges().subscribe( ses =>{
      this._SESSIONS = [];
      for(let d in ses){
        if(ses[d].id_user1 == this.user.getId() || ses[d].id_user2 == this.user.getId()){
          let fecha = (new Date(ses[d].last_msg_time).getHours()) + ':'+ (new Date(ses[d].last_msg_time).getMinutes());
          let session = new Session(ses[d].id,ses[d].id_user1,ses[d].username_user1,ses[d].id_user2,ses[d].username_user2,ses[d].last_msg,fecha);
          this._SESSIONS.push(session);
          console.log(this._SESSIONS)
        } 
      }
      setTimeout(()=>{
        this.content.scrollToBottom(300);
      },500);
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

  fabBut(fb: FabContainer){
    setTimeout(()=>{
      fb.close();
    },3000);
  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

  addContact(){
    let contact = this.modalCtrl.create(AddContactPage,{
      user: this.user
    });
    contact.onDidDismiss( data => {
      console.log(data)
    });
    contact.present();
  }

}

