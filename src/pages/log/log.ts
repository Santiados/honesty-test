import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { RegisterPage } from '../../pages/register/register';
import { HomePage } from '../../pages/home/home';

import { UserProvider } from '../../providers/user/user';
import { User } from '../../class/User';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
    private userService: UserProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogPage');
  }

  getUserByCredentials() {
    this.userService.getUserByCredentials(this.user)
      .then((result: User) => {
        console.log(result)
        this.navCtrl.push(HomePage, {
          data: result
        });
      }).catch((err) => {
        this.showNot(err.message);
      });
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

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

}
