import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


import { UserProvider } from '../../providers/user/user';



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

  user =  {
    username:'',
    password:''
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private userService: UserProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registrarUsuario(){
    let datosUsuario = this.user;
    this.userService.persist(datosUsuario)
    .then((result) => {
      console.log(result);
    }).catch((err) => {
      this.Jstr(err,'e');
    });
    this.viewCtrl.dismiss(datosUsuario);
  }

  Jstr(msg:any,flag = null){
    if(flag){
      console.error(JSON.stringify(msg));
    }else {
      console.log(JSON.stringify(msg));
    }
  }
}
