/**
 * Created by COM on 2017-08-07.
 */

import {Injectable} from "@angular/core";
import {AlertService} from "./alert.service";
import {Events} from "ionic-angular";
import { NFC, Ndef } from '@ionic-native/nfc';


@Injectable()
export class NfcService {


  constructor(private nfc: NFC
              , private ndef: Ndef
              , private alertService: AlertService
              , public events: Events ) {


  }

  // NFC 활성상태 확인
  checkNfcEnabled = function() {
    let message: string = '';
    this.nfc.enabled().then(
      () => {
        this.event.publish('nfc:status', 'T', '');
      },
      (err) => {
        // 1. NFC 지원 X
        if ( err == 'NO_NFC' ){
          this.event.publish('nfc:status', 'F', '지원하지 않는 단말기 입니다.');
        }
        else {
          this.event.publish('nfc:status', 'F', 'NFC 기능을 활성화해주세요.');
        }
      });
  }

  //NFC 쓰기
  textWrite = function(obj) {
    let message = [];
    message.push(this.ndef.textRecord(JSON.stringify(obj)));
    this.nfc.write(message)
      .then(()=>{ this.event.publish('nfc:write', 'true');  })    //쓰기 성공
      .catch(()=>{ this.event.publish('nfc:write', 'false');  });  //쓰기 실패
  }

  //NFC 공유
  p2pShare = function(obj) {
    let message = [];
    message.push(this.ndef.textRecord(JSON.stringify(obj)));
    this.nfc.share(message)
      .then(()=>{return true;})
      .catch(()=>{return false;});
  }

  //NFC 공유 제거
  p2pUnshare = function() {
    this.nfc.unshare()
      .then(()=>{ this.event.publish('nfc:unshare', 'true'); })
      .catch(()=>{ this.event.publish('nfc:unshare', 'false'); });
  }


  //EventListener

  //NdefListener
  setNdefListener = function() {
    return this.nfc.addNdefListener();
  }

  //Read Data
  readTextRecord = function(record) {
    let tag = record.tag;
    let payload = this.nfc.bytesToString(tag.ndefMessage[0].payload);
    return JSON.parse(payload.substring(3));
  }

  //NFC 설정화면
  moveToSettings = ()=>{
    this.nfc.showSettings();
  }

}
