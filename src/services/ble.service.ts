/**
 * Created by COM on 2017-08-07.
 */


import {Injectable} from "@angular/core";
import {BLE} from "@ionic-native/ble";
import {Events} from "ionic-angular";

@Injectable()

export class BleService {

  private readData: string = '';
  private STX_CODE: number = 2;
  private ETX_CODE: number = 3;
  private CRC_SIZE: number = 4;

  private TOPIC_BLE_NOTIFICATION = 'ble:notification';
  private TOPIC_DEVICE_SCAN = 'ble:scan';

  constructor(private ble: BLE
              , public events: Events)
  {

  }


  //블루투스 활성화 체크
  checkEnabled = () => {
    this.ble.isEnabled().then(
      () => { this.events.publish('ble:enabled', true, ''); },
      () => { this.events.publish('ble:enabled', false,  '비활성화 상태입니다.'); }
    );
  }

  //블루투스 장치과 연결 되었는지 체크
  checkConnected = (deviceId) => {
    this.ble.isConnected(deviceId).then(
      () => { this.events.publish('ble:connected', true, ''); },
      () => { this.events.publish('ble:connected', false,  '장치가 연결되어 있지 않습니다.'); }
    );
  }

  // 블루투스를 지원하는 단말기인지 체크
  enable = () =>{
    this.ble.enable().then(
      ()=>  {  this.events.publish('ble:setEnable', true, ''); },
      (error)=>  {  this.events.publish('ble:setEnable', false, error);  }
    );
  }

  // 디바이스에서 블루투스 설정 화면으로 이동
  showSettings = () => {

    //안드로이드에서만 지원
    this.ble.showBluetoothSettings();
  }

  // 장치 검색 시작
  startScan = (service: string[], option)=>{

    let bleList: Array<any> = [];

    this.ble.startScanWithOptions(service, '').subscribe(
      (device)=>{
        if (device.hasOwnProperty('name')) {

          this.events.publish('ble:scan', device);
        }
      }
    )
  }

  // 장치 검색 중지
  stopScan = ()=> {
    this.ble.stopScan().then(
      ()=>{ }
    )
  }

  // 장치 연결
  connect = (deviceId: string) => {

    this.ble.connect(deviceId).subscribe(
      (data)=>{
          console.log('connection-> ' + JSON.stringify(data));
          this.events.publish('ble:conn', true, '연결되었습니다.', this.getUUids(data));
        },
      (error)=>{
        // console.log('error->' + error);
        console.log('error->' + JSON.stringify(error));
        this.events.publish('ble:conn', false, '연결을 실패하였습니다 다시 시도해 주세요.', '');
      }
    );
  }

  // 장치 연결 끊기
  disconnect = (deviceId: string)=> {
    this.ble.disconnect(deviceId).then(
      ()=>{ this.events.publish('ble:disconn', true); },
      ()=>{ this.events.publish('ble:disconn', false); }
    )
  }

  // 장치에 데이터 쓰기 ( 보내기 )
  write = (action: string, deviceId: string, serviceUUID: string, characteristicUUID: string, data: any) => {

    // data 타입 : byte[]

    this.ble.write(deviceId, serviceUUID, characteristicUUID, data).then(
      (result)=>{
        this.events.publish(action, true);

      },
      (error)=>{
        this.events.publish(action, false);
      }
    );
  }

  //블루투스 장치로부터 데이터 수신 시작
  startNotification = (deviceId, serviceUUID, characteristicUUID)=> {
    this.ble.startNotification(deviceId, serviceUUID, characteristicUUID).subscribe(
      (data) =>{
        this.events.publish(this.TOPIC_BLE_NOTIFICATION, data);
        },
      ()=>{}
    );
  }

  //블루투스 장치로부터 수신 중지
  stopNotification = (deviceId: string, serviceUUID: string, characterist: string)=>{
    this.ble.stopNotification(deviceId, serviceUUID, characterist);
  }


  // 문자열 -> 바이트 배열
  str2byte = (string) => {

    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  // 바이트배열 -> 문자열
  byte2str = (buffer) => {

    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  // 연결 후 , 블루투스 장치의 UUID값 받기
  getUUids = (data)=> {

    let characteristics = data.characteristics;
    let characteristic = '';
    let service = '';

    for (let i = 0; i < characteristics.length; i++) {
      let nCharacteristics = characteristics[i];
      let properties = nCharacteristics.properties;

      let read: boolean = false;
      let write: boolean = false;
      for (let j = 0; j < properties.length; j++) {

        if (properties[j] == 'Write') {
          write = true;
        }
        if (properties[j] == 'Notify') {
          read = true;
        }

        if (write == true && read == true) {
          characteristic = characteristics[i].characteristic;
          service = characteristics[i].service;
        }
      }
    }

    return {
      characteristic: characteristic,
      service: service
    };

  }
}
