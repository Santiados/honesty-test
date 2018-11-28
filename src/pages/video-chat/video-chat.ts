import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ViewController } from 'ionic-angular';

declare var OT: any;

@IonicPage()
@Component({
  selector: 'page-video-chat',
  templateUrl: 'video-chat.html',
})
export class VideoChatPage {
  session: any;
  publisher: any;
  config;
  cameraSource = 0;
  devices: any[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toasCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.config = this.navParams.get('config');
    console.log('dasdast',this.navParams.get('config'))
    this.startCall();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoChatPage');
  }


  startCall() {
    this.session = OT.initSession(this.config.apiKey, this.config.sessionId);

    // Subscribe to a newly created stream
    this.session.on('streamCreated', (event) => {
      this.session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        resolution: '1280x720',
        showControls: false,
        width: '100%',
        height: '100%'
      });
    });

    this.session.on('sessionDisconnected', (event) => {

    });

    // Connect to the session
    this.session.connect(this.config.token, (error) => {
      if (!error) {
        // Create a publisher
        this.publisher = OT.initPublisher('publisher', {
          insertMode: 'append',
          resolution: '1280x720',
          width: '100%',
          height: '100%'
        });

        this.session.publish(this.publisher, (error) => {
          if (error) {
            console.log("Publisher error: " + error);
            this.handleError(error);
          }
        });
      } else {
        this.handleError(error);
      }
    });
  }

  // Ends call
  endCall() {
    if (!!this.session) {
      this.session.disconnect();
    }
  }

  // Switch between cameras
  toggleCamera() {
    this.cameraSource = this.cameraSource == 0 ? 1 : 0;
    this.session.unpublish(this.publisher);
    this.publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      resolution: '1280x720',
      width: '100%',
      height: '100%',
      videoSource: this.devices[this.cameraSource].deviceId
    }, this.handleError);
    this.session.publish(this.publisher);
  }

  handleError(e){
    this.showNot(e.message)
  }

  showNot(msg) {
    let toas = this.toasCtrl.create({
      message: msg,
      duration: 2000
    });
    toas.present();
  }


  close() {
    this.endCall();
    this.viewCtrl.dismiss();
  }

}
