import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Platform, LoadingController } from 'ionic-angular';

import { RegisterPage } from '../../pages/register/register';
import { HomePage } from '../../pages/home/home';

import { UserProvider } from '../../providers/user/user';
import { User } from '../../class/User';

import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";
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
    private translate: TranslateService,
    private platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private userService: UserProvider,
    private storage: Storage
  ) {
    this.storage.get('mio')
      .then((val) => {
        if (val) {
          this.user = val;
          this.getUserByCredentials();
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err, undefined, 2));
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogPage');
  }

  getUserByCredentials() {
    if (this.user.username.trim() != '' && this.user.password.trim() != '') {
      this.userService.getUserByCredentials(this.user)
        .then((result: User) => {
          this.showLoader();
          this.storage.set('mio', this.user);
          this.navCtrl.push(HomePage, {
            data: result
          });
        }).catch((err) => {
          this.translate.get('errors.' + err.code).subscribe(
            value => {
              this.showNot(value);
            }
          );
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
      duration: 100,
      content: this.trans('messages.momento')
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

  trans(msg) {
    let re = '';
    this.translate.get(msg).subscribe(
      value => {
        re = value;
      }
    );
    return re;
  }

}
