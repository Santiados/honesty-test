import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { SesionProvider } from '../../providers/sesion/sesion';
import { MessageProvider } from '../../providers/message/message';

import { User } from '../../class/User';
import { Session } from '../../class/Session';
import { Message } from '../../class/Message';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user: User;
  contact: User;
  _SESSION;
  _MESSAGES: Message[] = [];
  msgTemp: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msgsService: MessageProvider,
    private sessionService: SesionProvider
  ) {
    this.user = this.navParams.get('user');
    this.contact = this.navParams.get('contact');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  sendMsg() {
    if (this.msgTemp.trim() != ''){
      if (!this._SESSION) {
        this._SESSION = new Session(null, this.user.id_user,this.user.username, this.contact.id_user,this.contact.username);
      }
      this.sessionService.persist(this._SESSION)
        .then((result: Session) => {
          this._SESSION = result;
        }).catch((err) => {
          console.log(err)
        });

      console.log('ea', this._SESSION)
      let new_msg = new Message(null, this.msgTemp, this.user.id_user, this._SESSION.id);
      this.msgsService.persist(new_msg)
        .then((result: Message) => {
          this._MESSAGES.push(result);
          this.msgTemp = '';
        }).catch((err) => {
          console.log(err)
        });
    }
  }

}
