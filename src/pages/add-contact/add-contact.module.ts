import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactPage } from './add-contact';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddContactPage),
    TranslateModule.forChild()
  ],
})
export class AddContactPageModule {}
