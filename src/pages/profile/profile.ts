import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { User } from '../../class/User';

import { UserProvider } from '../../providers/user/user'; 

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toasCtrl: ToastController,
    private alertCtrl: AlertController
    ) {
      this.user = this.navParams.get('user');
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  close(){
    this.navCtrl.pop();
  }
}
