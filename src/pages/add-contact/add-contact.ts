import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';

import { User } from '../../class/User';

import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactPage {
  _USERS: User[] = [];
  mySearch: string = '';
  user: User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private toasCtrl: ToastController,
    private userService: UserProvider
    ) {
      this.user = this.navParams.get('user');
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContactPage');
  }

  onInput(){
    if(this.mySearch.trim() == ''){
      this._USERS = [];
    }else {
      this.userService.getUsersBySearching(this.mySearch,this.user)
      .then((result: User[]) => {
        this._USERS = result;
      }).catch((err) => {
        
      });
    }
    
  }

  onCancel(){

  }

  addToMyContacts(user,index){
    console.log(index)
    let alert = this.alertCtrl.create({
      message: '¿Quieres añadir a '+ user.username + '?',
      buttons: [
        {
          text: 'No',
          cssClass:'cancelar',
          handler:() => {
            this.showNot('Usuario no añadido');
          }
        },
        {
          text: 'Si, vamos',
          cssClass: 'adelante',
          handler: () =>{
            this.userService.addContact(user,this.user)
            .then((result) => {
              console.log(result);
              console.log('a',this._USERS)
              this._USERS.splice(index,1);
              console.log('d',this._USERS)
            }).catch((err) => {
              this.showNot(err.message);
            });
            this.showNot(user.username + ' añadido');
          }
        }
      ]
    });
    alert.present();
  }

  close(){
    this.viewCtrl.dismiss();
  }

  showNot(msg){
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 1000
    });
    toas.present();
  }

}
