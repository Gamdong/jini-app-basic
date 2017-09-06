import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignCheckPage } from './sign-check';

@NgModule({
  declarations: [
    SignCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(SignCheckPage),
  ],
})
export class SignCheckPageModule {}
