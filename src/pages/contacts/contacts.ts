import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { User  } from  '../../class/User';
import { ChatPage } from '../../pages/chat/chat';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  user: User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
      this.user = this.navParams.get('user');
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  createChatRoom(user:User,contact:User){
    this.navCtrl.push(ChatPage,{
      user: user,
      contact: contact
    });
  }

}
