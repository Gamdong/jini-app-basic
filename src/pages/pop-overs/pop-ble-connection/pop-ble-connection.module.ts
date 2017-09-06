import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopBleConnectionPage } from './pop-ble-connection';

@NgModule({
  declarations: [
    PopBleConnectionPage,
  ],
  imports: [
    IonicPageModule.forChild(PopBleConnectionPage),
  ],
})
export class PopBleConnectionPageModule {}
