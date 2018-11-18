import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { RegisterPage } from '../../pages/register/register';
import { HomePage } from '../../pages/home/home';

import { SesionProvider } from '../../providers/sesion/sesion';
import { UserProvider } from '../../providers/user/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

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

  user =  {
    username:'',
    password:''
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private userService: UserProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogPage');
  }

  getUserByCredentials(){
    this.userService.getUserByCredentials(this.user)
    .then((result) => {
      this.navCtrl.push(HomePage,{
        data: result
      });
    }).catch((err) => {
      console.log(err)
    });
  }

  getRegisterPage(){
    console.log('Register Page');
    let regPage = this.modalCtrl.create(RegisterPage);
    regPage.onDidDismiss( data => {
      if(data){
        this.user = data; 
      }
    });
    regPage.present();
  }

}
