import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User  } from  '../../class/User';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User;
  constructor(
    public navCtrl: NavController,
    private paramCtrl: NavParams
    ) {
      this.user = this.paramCtrl.get('data');
    }

    ionViewDidLoad(){
      console.log(this.user);
    }

    getMyContacts(){
      
    }

}
