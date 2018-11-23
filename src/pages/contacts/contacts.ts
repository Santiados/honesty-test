import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

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
@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  user: User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private userService: UserProvider
    ) {
      this.user = this.navParams.get('user');
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  createChatRoom(user:User,contact:User){
    this.userService.getUserById(contact.id_user)
    .then((result) => {
      this.navCtrl.push(ChatPage,{
        user: user,
        contact: result
      });
    });
  }

  addContact(){
    let modal = this.modalCtrl.create(AddContactPage);
    modal.onDidDismiss( data =>{
      console.log(data)
    });
    modal.present();
  }

  back(){
    this.navCtrl.pop();
  }

}
