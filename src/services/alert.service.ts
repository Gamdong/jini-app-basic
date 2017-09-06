/**
 *
 * Created by COM on 2017-08-07.
 * 사용자에게 메시지, 로딩 보여주기
 */


import {Injectable} from "@angular/core";
import {AlertController, LoadingController, ToastController} from "ionic-angular";

@Injectable()

export class AlertService{
  private toast: any;
  private alert: any;
  private loading: any;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController ) {

    console.log('loading AlertService');


  }

  // Toast 창 띄우기
  alertToast = (message: string, time: number)=> {

    let options:{[k: string]: any} = {};

    if (time == undefined) { time = 2000; }
    options.message = message;
    options.duration = time;
    options.position = 'top';

    this.toast = this.toastCtrl.create(options).present();
  }

  // Loading
  showLoading = (message: string, time: number) => {
    let options:{[k: string]: any} = {};
    options.content = message;
    this.loading = this.loadingCtrl.create(options);
    this.loading.present();

    if (time > 0) {
      setTimeout(
        ()=> { this.loading.dismiss(); }, time);
    }
  }

  hideLoading = () => {
    if (this.loading != undefined){
      this.loading.dismiss();
    }
  }



}

