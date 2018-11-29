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
  sub:any;
  config;
  cameraSource = 0;
  devices: any[];
  OpenSession: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toasCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.OpenSession = this.navParams.get('OpenSession');
    setTimeout(() => {
      this.startCall();
    }, 500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoChatPage');
  }


  startCall() {

    

    this.OpenSession.on('streamCreated', (event) => {
      event.preventDefault();
    });

    // Subscribe to a newly created stream
    this.OpenSession.on('streamCreated', (event) => {
      event.preventDefault();
      this.sub = this.OpenSession.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        resolution: '1280x720',
        showControls: false,
        width: '100%',
        height: '100%'
      });
    });

    this.OpenSession.on('signal:close', e => {
      if (e.from.connectionId != this.OpenSession.connection.id && this.OpenSession) {
        this.endCall();
        this.viewCtrl.dismiss();
      }
    });


    // Create a publisher
    this.publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      resolution: '1280x720',
      width: '100%',
      height: '100%'
    });

    this.OpenSession.publish(this.publisher, (error) => {
      if (error) {
        console.log("Publisher error: " + error);
        this.handleError(error);
      }
    });
  }

  // Ends call
  endCall() {
    if (!!this.OpenSession) {
      // this.OpenSession.disconnect();
      if(this.sub){
        this.OpenSession.unsubscribe(this.sub);
      }
      if(this.publisher){
        this.OpenSession.unpublish(this.publisher);
      }
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

  handleError(e) {
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
    this.OpenSession.signal({
      data:'close',
      type:'close'
    },err =>{
      if(err){
        this.showNot(err.message);
      }
    });
    this.endCall();
    this.viewCtrl.dismiss();
  }

}
