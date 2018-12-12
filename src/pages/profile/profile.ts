import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Platform } from 'ionic-angular';

import { User } from '../../class/User';

import { UserProvider } from '../../providers/user/user';
import { LoggedUserProvider } from '../../providers/logged-user/logged-user';
import { LogPage } from '../log/log';
import { TranslateService } from '@ngx-translate/core';

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
    private userService: UserProvider,
    private translate: TranslateService
  ) {
    if (this.navParams.get('user')) {
      this.user = this.navParams.get('user');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logOut() {
    this.showAlert(this.trans('profilepage.segurosalir'));
  }
  showLoader() {
    let load = this.loadCtrl.create({
      duration: 500,
      content: this.trans('messages.momento')
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
      cssClass: 'alertUser',
      buttons: [
        {
          text: this.trans('messages.si'),
          handler: () => {
            if (flag) {
              this.userService.delete(this.user)
                .then((result) => {

                }).catch((err) => {
                  this.showNot(this.trans('errors.' + err.message));
                });
            }
            this.showLoader();
          }
        }, {
          text: this.trans('messages.no'),
          cssClass: 'activeBut',
          handler: () => {
            this.showNot(this.trans('profilepage.bien'));
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
    this.showAlert(this.trans('profilepage.seguroborrar'), 'drop');
  }

  trans(msg) {
    let re = '';
    this.translate.get(msg).subscribe(
      value => {
        re = value;
      }
    );
    return re;
  }

  close() {
    this.navCtrl.pop();
  }
}
