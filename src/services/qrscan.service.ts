

import {Injectable} from "@angular/core";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {Observable} from "rxjs/Observable";

@Injectable()
export class QrscanService{

  constructor(private qrScanner: QRScanner) {

  }


  checkPermission(): Promise<any> {
    return this.qrScanner.prepare();
  }



  scan(): Observable<string> {
    return this.qrScanner.scan();
  }

  showCamera(): Promise<any> {
    return this.qrScanner.show();
  }


}
