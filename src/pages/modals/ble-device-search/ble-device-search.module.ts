import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BleDeviceSearchPage } from './ble-device-search';

@NgModule({
  declarations: [
    BleDeviceSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(BleDeviceSearchPage),
  ],
})
export class BleDeviceSearchPageModule {}
