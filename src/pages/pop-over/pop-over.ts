import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../class/User';

/**
 * Generated class for the PopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {
  user: User;
  data;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(this.navParams.get('data')){
      this.data = this.navParams.get('data');
      this.user = this.navParams.get('data.user');
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverPage');
  }

}
