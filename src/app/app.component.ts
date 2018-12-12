import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LogPage } from '../pages/log/log';
import { AddContactPage } from '../pages/add-contact/add-contact';
import { ProfilePage } from '../pages/profile/profile';
import { ContactsPage } from '../pages/contacts/contacts';
import { VideoChatPage } from '../pages/video-chat/video-chat';

import { SQLite } from '@ionic-native/sqlite';
import { LoggedUserProvider } from '../providers/logged-user/logged-user';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = null;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private Sqlite: SQLite,
    private log_users: LoggedUserProvider,
    private translate: TranslateService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      

      this.translate.setDefaultLang('es');
      this.translate.use('es');

      if (platform.is('android') || platform.is('ios')) {
        statusBar.styleLightContent();
        this.createDatabase();
      } else {
        statusBar.styleDefault();
        this.splashScreen.hide();
        this.rootPage = LogPage;
      }

    });
  }

  private createDatabase() {
    this.Sqlite.create({
      name: 'data.db',
      location: 'default' // the location field is required
    })
      .then((db) => {
        this.log_users.setDB(db);
        return this.log_users.userLoggedTable();
      })
      .then(() => {
        this.splashScreen.hide();
        this.rootPage = LogPage;
      })
      .catch(error => {
        console.error(error);
      });
  }
}

