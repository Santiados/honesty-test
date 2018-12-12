import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';


import { UserProvider } from '../../providers/user/user';

import { HomePage } from '../../pages/home/home';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {
    username: '',
    password: '',
    state: 'publico'
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toasCtrl: ToastController,
    private userService: UserProvider,
    private loadCtrl: LoadingController,
    private translate: TranslateService,
    private storate: Storage
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registrarUsuario() {
    if (this.user.username.trim() != '' && this.user.password.trim() != '') {
      let datosUsuario = this.user;
      this.userService.persist(datosUsuario)
        .then((result) => {
          delete this.user.state;
          this.storate.set('mio',this.user);
          let load = this.loadCtrl.create({
            content: this.trans('registerpage.nuevo')
          });
          load.present();
          setTimeout(() => {
            load.dismiss();
            this.navCtrl.push(HomePage, {
              data: result
            });
          }, 2000);
        }).catch((err) => {
          this.showNot(this.trans('errors.' + err.code));
        });
    }
  }

  Jstr(msg: any, flag = null) {
    if (flag) {
      console.error(JSON.stringify(msg));
    } else {
      console.log(JSON.stringify(msg));
    }
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

  close() {
    this.viewCtrl.dismiss();
  }
}
