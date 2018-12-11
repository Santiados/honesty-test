import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Content, ModalController, AlertController } from 'ionic-angular';

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
import { VideoChatPage } from '../video-chat/video-chat';

declare var OT: any;

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
  msgTemp: string = '';
  msgsRF = firebase.database().ref('msgs');
  configOpen = {
    apiKey: '',
    sessionId: '',
    token: ''
  };
  OpenSession: any;
  connected = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
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
    this.OpenSession = null;

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
  ionViewDidLeave() {
    if (this.OpenSession) {
      this.OpenSession.connection.destroy();
      this.OpenSession.disconnect();
      this.OpenSession.destroy();
      console.log('desconectado');
    }
  }


  initOpen() {
    this.OpenSession = OT.initSession(this.configOpen.apiKey, this.configOpen.sessionId);

    this.OpenSession.connect(this.configOpen.token, err => {
      if (err) {
        this.connected = false;
        this.showNot(err.message);
      } else {
        this.OpenSession.off('connectionCreated connectionDestroyed signal:call signal:refuse signal:accept signal:close');
        this.OpenSession.on({
          connectionCreated: (e) => {
            if (e.connection.connectionId != this.OpenSession.connection.connectionId) {
              this.connected = true;
              this.showNot(this.contact.getUsername() + ' se ha conectado');
            }
          },
          connectionDestroyed: (e) => {
            this.connected = false;
            this.showNot(this.contact.getUsername() + ' se ha desconectado');
          },
          sessionDisconnected: (e) => {
            e.preventDefault();
            if (e.isDefaultPrevented()) {
            }
          },
          sessionConnected: (e) => {
            e.preventDefault();
            if (e.isDefaultPrevented()) {
            }
          }
        });

        this.OpenSession.on('signal:call', e => {
          if (e.from.connectionId != this.OpenSession.connection.id && this.OpenSession) {
            let alert = this.prepareCall();
            alert.present();
          }
        });
        this.OpenSession.on('signal:refuse', e => {
          if (e.from.connectionId != this.OpenSession.connection.id && this.OpenSession) {
            this.showNot(this.contact.getUsername() + ' ha pasado de ti');
          }
        });
        this.OpenSession.on('signal:accept', e => {
          if (e.from.connectionId != this.OpenSession.connection.id && this.OpenSession) {
            this.goVideo();
          }
        });
      }
    });

  }



  call() {
    this.sendSignal('call');
  }

  getSessionId() {
    this._HTTP.get(this.url + 'getSessionId')
      .map(res => res.json())
      .subscribe(data => {
        this._SESSION.setSessionOpen(data.sessionId);
        this.sessionService.persist(this._SESSION);
      }, error => {
        this.showNot(error.message);
      });
  }

  getToken() {
    this._HTTP.get(this.url + 'getToken/' + this._SESSION.sessionOpen)
      .map(res => res.json())
      .subscribe(data => {
        this.configOpen.apiKey = data.apiKey;
        this.configOpen.sessionId = this._SESSION.getSessionOpen();
        this.configOpen.token = data.token;
        this.initOpen();
      }, error => {
        this.showNot(error.message);
      });
  }


  sendMsg() {
    if (this.msgTemp.trim() != '') {
      if (!this._SESSION.id) {
        this._SESSION = new Session(null, this.user.getId(), this.user.getUsername(), this.contact.getId(), this.contact.getUsername());
        this.getSessionId();
      }

      setTimeout(() => {
        this._SESSION.setLast_Msg(this.msgTemp);
        this._SESSION.setLast_Msg_Time(new Date().toJSON());
        this.sessionService.persist(this._SESSION)
          .then((result) => {
            let new_msg = new Message(null, this.msgTemp, this.user.getId(), this._SESSION.id);
            this.msgsService.persist(new_msg)
              .then((result) => {
                this.msgTemp = '';
                this.getToken();
              }).catch((err) => {
                this.showNot(err.message);
              });
          })
          .catch((err) => {
            this.showNot(err.message);
          });
      }, 100);


    }
  }


  prepareCall() {
    let alert = this.alertCtrl.create({
      title: 'Llamada de ' + this.contact.getUsername(),
      cssClass:'alertUser',
      buttons: [
        {
          text: 'Pasar',
          handler: () => {
            this.sendSignal('refuse');
            this.showNot('Has pasado de ' + this.contact.getUsername());
          }
        },
        {
          text: 'Coger',
          cssClass: 'activeBut',
          handler: () => {
            this.sendSignal('accept');
            this.goVideo();
          }
        }
      ]
    });
    return alert;
  }

  goVideo() {
    let modal = this.modalCtrl.create(VideoChatPage, {
      OpenSession: this.OpenSession
    });
    modal.onDidDismiss(() => {
      this.showNot('Llamada terminada');
    });
    modal.present();
  }

  sendSignal(type) {
    this.OpenSession.signal({
      data: type,
      type: type
    }, err => {
      if (err) {
        this.showNot(err.message);
      }
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
