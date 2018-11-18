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

import { SesionProvider } from '../providers/sesion/sesion';
import { UserProvider } from '../providers/user/user';
import { MessageProvider } from '../providers/message/message';

import { fireConfig } from '../configFire';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LogPage,
    ChatPage,
    RegisterPage
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
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SesionProvider,
    UserProvider,
    MessageProvider,
    FireAuthProvider
  ]
})
export class AppModule {}
