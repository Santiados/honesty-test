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

import { SesionProvider } from '../providers/sesion/sesion';
import { UserProvider } from '../providers/user/user';
import { MessageProvider } from '../providers/message/message';

import { fireConfig } from '../configFire';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';
import { AngularFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LogPage,
    ChatPage,
    RegisterPage,
    ContactsPage,
    AddContactPage,
    PopOverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(fireConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
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
    PopOverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SesionProvider,
    UserProvider,
    MessageProvider,
    FireAuthProvider,
    AngularFirestore
  ]
})
export class AppModule {}
