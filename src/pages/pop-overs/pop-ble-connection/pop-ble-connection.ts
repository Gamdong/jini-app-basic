import { Component } from '@angular/core';
import {Alert, Events, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
// import {BluetoothSocketService} from "../../../services/bluetooth-socket.service";
import {BleService} from "../../../services/ble.service";
import {BleDeviceSearchPage} from "../../modals/ble-device-search/ble-device-search";
import {bleDevice} from "../../../app/app.module";
import {AlertService} from "../../../services/alert.service";
import {isSuccess} from "@angular/http/src/http_utils";

/**
 * Generated class for the PopBleConnectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-ble-connection',
  templateUrl: 'pop-ble-connection.html',
  providers: [BleService, AlertService]
})
export class PopBleConnectionPage {

  private TOPIC_BLE_CONNECTION = 'ble:conn';
  private TOPIC_BLE_DISCONNECTION = 'ble:disconn';
  private TOPIC_DEVICE_SCAN = 'ble:scan';


  constructor(public navCtrl: NavController
              , public modalCtrl: ModalController
              , private alertService: AlertService
              , public events: Events
              , public viewCtrl: ViewController
              , private ble: BleService
              , public navParams: NavParams) {
  }

  popButtonDisable(type){

    // 연결버튼
    let btnConnectionDisable = ()=>{
      // console.log('HI->');
      if (bleDevice.connected == true || bleDevice.deviceId == '') return true;
      else return false;
    }

    // 연결 끊기 버튼
    let btnDisconnectionDisable = ()=>{
      if (bleDevice.connected != true) return true;
      else return false;
    }

    if ( type == 'btn-connection') {
      // console.log('btnConnectionDisabled->' + btnConnectionDisable());
      return btnConnectionDisable();
    }
    else if ( type == 'btn-disconnection') {
      // return btnDisconnectionDisable();
    }
  }

  action(type){

    switch (type) {

      case 'ble-search' :
        // console.log('ble-search');
        this.presentModal();
        break;

      case 'connection' :
        if(!bleDevice.scaned){
          //장치검색을 수행하지 않았을 경우, 백그라운드에서 해당 deviceId를 가지 블루투스 장치를 검색 후 연결 시도

          //Show Loading
          this.alertService.showLoading('블루투스 연결 중', 0);

          //변수 초기화
          let scanning: boolean = true; // 스캔 중
          let deviceId: string = bleDevice.deviceId;

          this.ble.startScan([], '');

          //Scan된 블루투스 장치 목록
          this.events.subscribe(this.TOPIC_DEVICE_SCAN, (device)=>{
            if (device == deviceId) {   //저장된, deviceId에 해당하는 장치 찾음

              bleDevice.scaned = true;
              //스캔 중지
              this.stopScan();
              scanning = false;

              bleDevice.scaned = true;

              //블루투스 장치 연결, Loading 띄우지 않음
              this.connect(deviceId, false);
            }
          });

          //장치 검색 중지 타이머, 최대 스캔 시간 5초
          setTimeout(()=>{

            // 연결 실패 (=장치 찾지 못함)
            // 스캔 중이면, 스캔 종료
            if (scanning) {
              this.connect(deviceId, false); //연결 시도해도, 연결 실패 처리됨
              this.stopScan();
            }
          }, 5000);
        }
        break;

      case 'disconnection' :
        this.disconnect(bleDevice.deviceId);
        break;
    }
    this.modalClose();
  }

  stopScan(){
    this.ble.stopScan();
  }

  modalClose = ()=>{
    this.viewCtrl.dismiss();
  }

  presentModal() {
    let modal = this.modalCtrl.create(BleDeviceSearchPage);
    modal.onDidDismiss((action) => {
      console.log(action);
      if (action == 'cancel' || bleDevice.deviceId == '') return;

      //장치 연결
      this.connect(bleDevice.deviceId, true);

    });
    modal.present();
  }

  connect(deviceId, loading) {

    //show Loading
    if (loading) this.alertService.showLoading('블루투스 연결 중', 0);

    //블루투스 연결
    this.ble.connect(deviceId);

    //연결 결과 callback
    this.events.subscribe(this.TOPIC_BLE_CONNECTION, this.connectSuccessCallback);
  }

  connectSuccessCallback = (isConnected, message, device)=>{
    //연결중 로딩 끄기
    this.alertService.hideLoading();

    if (!isConnected){

      //연결 후 , 연결 끊어짐
      if (bleDevice.connected){
        message = '연결이 끊어졌습니다.';

        //블루투스 연결에 대한 결과 수신 중단
        this.stopEventReciveEvent(this.TOPIC_BLE_CONNECTION);
      }

      //ELSE ; 연결 시도, 연결 실패
    }
    this.alertService.alertToast(message, 3000);
    bleDevice.connected = isConnected;

    // 연결 실패면 리턴
    if (!isConnected) return;
    bleDevice.serviceUUID = device.service;
    bleDevice.characteristicUUID = device.characteristic;
  }

  disconnect(deviceId){
    this.ble.disconnect(deviceId);
    this.events.subscribe('ble:disconn', (result)=> {
      if (!result){
        this.alertService.alertToast('연결 끊기 실패', 2000);
        return;
      }
      bleDevice.connected = false;
      this.stopEventReciveEvent(this.TOPIC_BLE_DISCONNECTION);
    });
  }

  stopEventReciveEvent = (topic) => {
    this.events.unsubscribe(topic);
  }

}
