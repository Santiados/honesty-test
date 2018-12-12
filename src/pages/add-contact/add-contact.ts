import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';

import { User } from '../../class/User';

import { UserProvider } from '../../providers/user/user';
import { TranslateService } from '@ngx-translate/core';

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
    private userService: UserProvider,
    private translate: TranslateService
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
        this.showNot(this.trans('errors.' + err.message));
      });
    }
    
  }

  onCancel(){

  }

  addToMyContacts(user,index){
    let alert = this.alertCtrl.create({
      message: this.trans('addcontactpage.seguroadd') + user.username + '?',
      buttons: [
        {
          text: this.trans('messages.no'),
          handler:() => {
            this.showNot(this.trans('addcontactpage.usernoadd'));
          }
        },
        {
          text: this.trans('messages.si2'),
          cssClass: 'activeBut',
          handler: () =>{
            this.userService.addContact(user,this.user)
            .then((result) => {
              this._USERS.splice(index,1);
            }).catch((err) => {
              this.showNot(err.message);
            });
            this.showNot(user.username + this.trans('addcontactpage.useradd'));
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
