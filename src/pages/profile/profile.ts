import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Platform, PopoverController } from 'ionic-angular';

import { User } from '../../class/User';

import { UserProvider } from '../../providers/user/user';
import { LogPage } from '../log/log';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import QRCode from 'qrcode';
import { PopOverPage } from '../pop-over/pop-over';

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
    private popOver: PopoverController,
    private toasCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private userService: UserProvider,
    private storage: Storage,
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
      this.storage.remove('mio');
      this.navCtrl.setRoot(LogPage);
      this.navCtrl.getViews().forEach((e)=>{
        console.log(e.name)
      });
    })
    load.present();
  }


  showAlert(msg, flag = null) {
    let alert = this.alertCtrl.create({
      title: this.trans('profilepage.alerttitle'),
      message: msg,
      cssClass: 'alertUser2',
      buttons: [
        {
          text: this.trans('messages.si'),
          cssClass: 'si-but',
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
          cssClass: 'no-but',
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

  showQR(){
    const qr = QRCode;
    const self = this;
    let imgQRbase64 = '';
    qr.toDataURL(self.user.getId(), { errorCorrectionLevel: 'H' }, function (err, url) {
      if (url != undefined) {
        imgQRbase64 = url;
      }
    });
    let pop = this.popOver.create(PopOverPage,{
      data: {
        qrcode: imgQRbase64,
        plantilla: 'qrcode',
        user:this.user
      }
    },{
      cssClass: 'qrcode'
    });
    pop.present({
      animate: false
    });
  }
}
