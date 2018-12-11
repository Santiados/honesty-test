import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Platform, LoadingController } from 'ionic-angular';

import { RegisterPage } from '../../pages/register/register';
import { HomePage } from '../../pages/home/home';

import { UserProvider } from '../../providers/user/user';
import { User } from '../../class/User';
import { LoggedUserProvider } from '../../providers/logged-user/logged-user';

/**
 * Generated class for the LogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-log',
  templateUrl: 'log.html',
})
export class LogPage {

  user = {
    username: '',
    password: ''
  }
  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private userService: UserProvider,
    private log_users: LoggedUserProvider
  ) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.log_users.getLoggedUser()
        .then((result) => {
          this.user.username = result[0].username;
          this.user.password = result[0].password;
          this.getUserByCredentials();
        }).catch((err) => {
          console.error(JSON.stringify(err));
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogPage');
  }

  getUserByCredentials() {
    if (this.user.username.trim() != '' && this.user.password.trim() != '') {
      this.userService.getUserByCredentials(this.user)
        .then((result: User) => {
          this.showLoader();
          if (this.platform.is('android') || this.platform.is('ios')) {
            this.log_users.insertUsers(this.user.username, this.user.password);
          }
          this.navCtrl.push(HomePage, {
            data: result
          });
        }).catch((err) => {
          this.showNot(err.message);
          console.log('er', err)
        });
    }
  }

  getRegisterPage() {
    console.log('Register Page');
    let regPage = this.modalCtrl.create(RegisterPage);
    regPage.onDidDismiss(data => {
      if (data) {
        this.user = data;
      }
    });
    regPage.present();
  }

  showLoader() {
    let load = this.loadCtrl.create({
      duration: 500,
      content: 'Un momento...'
    });
    load.present();
  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

}
