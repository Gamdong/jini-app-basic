import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {PopBleConnectionPage} from "../../pop-overs/pop-ble-connection/pop-ble-connection";
import {BleService} from "../../../services/ble.service";
import {AlertService} from "../../../services/alert.service";
import {bleDevice} from "../../../app/app.module";

/**
 * Generated class for the BleDeviceSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ble-device-search',
  templateUrl: 'ble-device-search.html',
  providers: [BleService, AlertService]
})
export class BleDeviceSearchPage {

  private sendData: string = '';
  private devices: any[] = [];
  private scanning: boolean = false;

  private TOPIC_DEVICE_SCAN = 'ble:scan';

  constructor(public navCtrl: NavController
              , public viewCtrl: ViewController
              , public popoverCtrl: PopoverController
              , private ble: BleService
              , private alertService: AlertService
              , private events: Events
              , public navParams: NavParams) {

    this.sendData = this.navParams.get('getData');
  }

  selectDevice(device: any){
    console.log('device click ->' + JSON.stringify(device));
    if (device.id == '') {
      this.alertService.alertToast('블루투스 장치를 찾을 수 없습니다.', 2000);
      return;
    }

    localStorage.setItem('bleDevice', JSON.stringify(device));
    bleDevice.deviceId = device.id;
    bleDevice.deviceName = device.name;
    this.dismiss('connect');
  }

  dismiss(action) {
    this.viewCtrl.dismiss(action);
  }

  startScan() {

    this.scanning = true;
    //show Loading
    this.alertService.showLoading('블루투스 장치 검색 중', 0);
    this.ble.startScan([], '');
    this.events.subscribe(this.TOPIC_DEVICE_SCAN,
      (device)=>{

        let added: boolean = false;
        for (let i=0; i<this.devices.length; i++)
        {
          let addedDevice: any = this.devices[i];
          if (device.id == addedDevice.id) {
            added = true;
          }
        }
        if (added == true) return;
        this.devices.push(device);
      });

    //장치 검색 중지 타이머
    setTimeout(()=>{
      if (this.scanning) this.stopScan();
    }, 5000);
  }

  stopScan() {
    this.alertService.hideLoading();
    this.scanning = false;

    this.ble.stopScan();
  }

  // connect() {
  //   this.ble.connect(bleDevice.deviceId);
  //   //show Loading
  //   this.alertService.showLoading('블루투스 연결 중', 0);
  //
  //   //연결 결과 callback
  //   this.events.subscribe('', this.connectSuccessCallback);
  // }
  //
  // connectSuccessCallback = (isConnected, message, device)=>{
  //   //연결중 로딩 끄기
  //   this.alertService.hideLoading();
  //   if (!isConnected) {
  //     this.alertService.alertToast(message, 3000);
  //   }
  // }
}
