import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { User  } from  '../../class/User';
import { ChatPage } from '../../pages/chat/chat';
import { AddContactPage } from '../../pages/add-contact/add-contact';

import { UserProvider } from '../../providers/user/user';
import { SesionProvider } from '../../providers/sesion/sesion';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Session } from '../../class/Session';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  user: User;
  _CONTACTS: User[] = [];
  usersRF = firebase.database().ref('users');
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private toasCtrl: ToastController,
    private userService: UserProvider,
    private sessionService: SesionProvider,
    private db: AngularFireDatabase
    ) {
      this.user = this.navParams.get('user');
      this.usersRF.child(this.user.getId() + '/contacts').on('value', data =>{
        this._CONTACTS = [];
        data.forEach(element => {
          let el = element.val();
          let contact = new User(el.id,el.username);
          this._CONTACTS.push(contact);
          this.user.setContacts(this._CONTACTS);
        });
      });
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  createChatRoom(user:User,contact:User){
    this.trace(contact)
    this.trace(user)
    this.sessionService.getSessionByUsers(user.getId(),contact.getId())
    .then((resultSession:Session[]) => {
      this.userService.getUserById(contact.getId())
      .then((resultUser:User) => {
        this.navCtrl.push(ChatPage,{
          user: user,
          contact: resultUser,
          session: (resultSession.length > 0) ? resultSession[0]: null
        });
      });
    }).catch((err) => {
      this.showNot(err.message);
    });
    
  }

  addContact(){
    let modal = this.modalCtrl.create(AddContactPage,{
      user:this.user
    });
    modal.onDidDismiss( data =>{
      console.log('res',data)
    });
    modal.present();
  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

  back(){
    this.navCtrl.pop();
  }

  trace(e){
    console.log('trace-contacts',e)
    console.log(ContactsPage.constructor.name)
  }

}
