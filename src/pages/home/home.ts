import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



import { SesionProvider } from '../../providers/sesion/sesion';

import { ContactsPage } from '../../pages/contacts/contacts';
import { ChatPage } from '../../pages/chat/chat';
import { Session } from '../../class/Session';
import { User  } from  '../../class/User';

import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User;
  _SESSIONS: Session[] = [];
  constructor(
    public navCtrl: NavController,
    private paramCtrl: NavParams,
    private sessionService: SesionProvider
    ) {
      this.user = this.paramCtrl.data.data;
    }

    ionViewDidLoad(){
      console.log('hola');
    }
    ionViewCanEnter(){
      this.getMySessions();
    }

    getMyContacts(){
      this.navCtrl.push(ContactsPage,{
        user: this.user
      });
    }
    
    getMySessions(){
      this.sessionService.getSessionsByIdUser(this.user)
      .then((result:Session[]) => {
        this._SESSIONS = result;
      }).catch((err) => {
        
      });
    }

    goSession(session:Session){
      this.navCtrl.push(ChatPage,{
        session: session
      });
    }

}
