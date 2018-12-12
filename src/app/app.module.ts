import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LogPage  } from '../pages/log/log';
import { ChatPage } from '../pages/chat/chat';
import { RegisterPage } from '../pages/register/register';
import { ContactsPage } from '../pages/contacts/contacts';
import { AddContactPage } from '../pages/add-contact/add-contact';
import { PopOverPage } from '../pages/pop-over/pop-over';
import { ProfilePage } from '../pages/profile/profile';
import { VideoChatPage } from '../pages/video-chat/video-chat';

import { SesionProvider } from '../providers/sesion/sesion';
import { UserProvider } from '../providers/user/user';
import { MessageProvider } from '../providers/message/message';

import { fireConfig } from '../configFire';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Http, HttpModule } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';
import { LoggedUserProvider } from '../providers/logged-user/logged-user';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule  } from "@ionic/storage" ;

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LogPage,
    ChatPage,
    RegisterPage,
    ContactsPage,
    AddContactPage,
    PopOverPage,
    ProfilePage,
    VideoChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(fireConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LogPage,
    ChatPage,
    RegisterPage,
    ContactsPage,
    AddContactPage,
    PopOverPage,
    ProfilePage,
    VideoChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SesionProvider,
    UserProvider,
    MessageProvider,
    FireAuthProvider,
    AngularFirestore,
    LoggedUserProvider
  ]
})
export class AppModule {}
