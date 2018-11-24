import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LogPage } from '../pages/log/log';
import { AddContactPage  } from '../pages/add-contact/add-contact';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LogPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(platform.is('android') || platform.is('ios')){
        statusBar.styleLightContent();
      } else {
        statusBar.styleDefault();
      }
      splashScreen.hide();
    });
  }
}

