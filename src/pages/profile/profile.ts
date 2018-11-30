import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { User } from '../../class/User';

import { UserProvider } from '../../providers/user/user';
import { LoggedUserProvider } from '../../providers/logged-user/logged-user';
import { LogPage } from '../log/log';

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
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private log_users: LoggedUserProvider
  ) {
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logOut() {
    let alert = this.alertCtrl.create({
      title:'¿Seguro quieres salir?',
      buttons: [
        {
          text: 'No',
          handler: ()=>{
            this.showNot('Que bien, te quedas');
          }
        },
        {
          text:'Si',
          handler:()=>{
            this.showLoader();
          }
        }
      ]
    });
    alert.present();
  }
  showLoader() {
    let load = this.loadCtrl.create({
      duration: 500,
      content: 'Un momento...'
    });
    load.onDidDismiss(() => {
      this.log_users.delete();
      this.navCtrl.setRoot(LogPage);
    })
    load.present();
  }
  
  showNot(msg){
    let toas = this.toasCtrl.create({
      message: msg,
      duration:2000
    });
    toas.present();
  }

  close() {
    this.navCtrl.pop();
  }
}
