import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Content, ModalController } from 'ionic-angular';

import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';

import { Http, Headers } from '@angular/http';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { SesionProvider } from '../../providers/sesion/sesion';
import { MessageProvider } from '../../providers/message/message';

import { User } from '../../class/User';
import { Session } from '../../class/Session';
import { Message } from '../../class/Message';
import * as firebase from 'firebase/app';
import { UserProvider } from '../../providers/user/user';

import { map } from 'rxjs/operators';
import { getAllDebugNodes } from '@angular/core/src/debug/debug_node';
import { VideoChatPage } from '../video-chat/video-chat';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  private url: string = 'http://192.168.137.1:3000/';
  user: User = new User();
  contact: User = new User();
  _SESSION: Session = new Session();
  _MESSAGES: Message[] = [];
  msgTemp: string;
  msgsRF = firebase.database().ref('msgs');
  configOpen = {
    apiKey: '',
    sessionId: '',
    token:''
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
    private msgsService: MessageProvider,
    private sessionService: SesionProvider,
    private userService: UserProvider,
    private _HTTP: Http,
    private readonly db: AngularFireDatabase
  ) {
    if (!this.navParams.get('session')) {
      console.log('no session')
      this.user = this.navParams.get('user');
      this.contact = this.navParams.get('contact');
    } else {
      console.log('si session')
      this._SESSION = this.navParams.get('session');
      this.user = this.navParams.get('user');
      this.contact = this.navParams.get('contact');
      this.getToken();
    }

    this.db.object('msgs').valueChanges().subscribe(msgs => {
      this._MESSAGES = [];
      if (this._SESSION.id) {
        for (let d in msgs) {
          if (msgs[d].id_session == this._SESSION.getId()) {
            let msg = new Message(msgs[d].id, msgs[d].content, msgs[d].id_user, msgs[d].id_session, msgs[d].creation);
            this._MESSAGES.push(msg);
          }
        }
      }
      setTimeout(() => {
        if (this.content._scroll) {
          this.content.scrollToBottom(200);
        }
      }, 500);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  setMsgs(data) {
    let aux = [];
    data.forEach(element => {
      aux.push(element.val());
    });
    return aux;
  }

  sendMsg() {
    if (this.msgTemp.trim() != '') {
      if (!this._SESSION.id) {
        this._SESSION = new Session(null, this.user.getId(), this.user.getUsername(), this.contact.getId(), this.contact.getUsername());
        this.getSessionId();
      }
      this._SESSION.setLast_Msg(this.msgTemp);
      this._SESSION.setLast_Msg_Time(new Date().toJSON());
      this.sessionService.persist(this._SESSION)
        .then((result) => {

          let new_msg = new Message(null, this.msgTemp, this.user.getId(), this._SESSION.id);
          this.msgsService.persist(new_msg)
            .then((result) => {
              this.msgTemp = '';
            }).catch((err) => {
              this.showNot(err.message);
            });
        }).catch((err) => {
          this.showNot(err.message);
        });
    }
  }

  call(){
    console.log(this.configOpen)
    let modal = this.modalCtrl.create(VideoChatPage,{
      config: this.configOpen,
      user: this.user,
      contact: this.contact
    });
    modal.present();
  }

  getSessionId(){
    this._HTTP.get(this.url + 'getSessionId')
      .map(res => res.json())
      .subscribe(data => {
        this.configOpen = data;
        console.log(JSON.stringify(data))
        this._SESSION.setSessionOpen(data.sessionId);
        this.sessionService.persist(this._SESSION)
        .then((res)=>{
          console.log(res)
          this.getToken();
        })
        .catch((e)=>{
          this.showNot(e.message)
        });
      }, error => {
        this.showNot(error.message);
      });
  }

  getToken() {
    this._HTTP.get(this.url + 'getToken/' + this._SESSION.sessionOpen)
      .map(res => res.json())
      .subscribe(data => {
        this.configOpen = data;
        console.log('tokens',this.configOpen)
      }, error => {
        this.showNot(error.message);
      });
  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }

}
