import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User  } from  '../../class/User';

import { SesionProvider } from '../../providers/sesion/sesion';

import { ContactsPage } from '../../pages/contacts/contacts';
import { Session } from '../../class/Session';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user;
  _SESSIONS: Session[];
  constructor(
    public navCtrl: NavController,
    private paramCtrl: NavParams,
    private sessionService: SesionProvider
    ) {
      this.user = this.paramCtrl.data.data;
      this.getMySessions();
    }

    ionViewDidLoad(){
      console.log('hola',this.user);
    }

    getMyContacts(){
      this.navCtrl.push(ContactsPage,{
        user: this.user
      });
    }
    
    getMySessions(){
      console.log(typeof this.user)
      this.sessionService.getSessionsByIdUser(this.user);
    }

}
