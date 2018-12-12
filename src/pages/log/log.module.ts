import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogPage } from './log';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    LogPage,
  ],
  imports: [
    IonicPageModule.forChild(LogPage),
    TranslateModule.forChild(),
    IonicStorageModule
  ],
})
export class LogPageModule {}
