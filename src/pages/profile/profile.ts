import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Platform } from 'ionic-angular';

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
  user: User = new User('1', 'as', 'd', 'a', 'primary', 0);
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private toasCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private log_users: LoggedUserProvider,
    private userService: UserProvider
  ) {
    if (this.navParams.get('user')) {
      this.user = this.navParams.get('user');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logOut() {
    this.showAlert('¿Seguro quieres salir?');
  }
  showLoader() {
    let load = this.loadCtrl.create({
      duration: 500,
      content: 'Un momento...'
    });
    load.onDidDismiss(() => {
      if (this.platform.is('android') || this.platform.is('ios')) this.log_users.delete();
      this.navCtrl.setRoot(LogPage);
    })
    load.present();
  }


  showAlert(msg, flag = null) {
    let alert = this.alertCtrl.create({
      title: msg,
      cssClass:'alertUser',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            if (flag) {
              this.userService.delete(this.user)
                .then((result) => {
                  
                }).catch((err) => {
                  this.showNot(err.message);
                });
            }
            this.showLoader();
          }
        },{
          text: 'No',
          cssClass:'activeBut',
          handler: () => {
            this.showNot('Que bien, te quedas');
          }
        }
      ]
    });
    alert.present();
  }
  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

  deleteMyAccount() {
    this.showAlert('¿Seguro quieres borrar tu cuenta?', 'drop');
  }

  close() {
    this.navCtrl.pop();
  }
}
