import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//modules
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";
import {Http} from "@angular/http";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";
import {RestangularModule} from "ng2-restangular";

import {AlertService} from "../services/alert.service";
import {StorageService} from "../services/storage.service";
import {SignCheckPage} from "../pages/sign/sign-check/sign-check";
import {SignInPage} from "../pages/sign/sign-in/sign-in";

//pages



@NgModule({
  declarations: [
    MyApp,
    SignCheckPage,
    SignInPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    RestangularModule.forRoot(RestangularConfigFactory),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignCheckPage,
    SignInPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    AlertService,
    StorageService,

  ]
})
export class AppModule {}


//RESTful, ng2-restangluar
export function RestangularConfigFactory (RestangularProvider) {

  RestangularProvider.setBaseUrl('https://beverage-ko.posissuer.com/app/api');
  RestangularProvider.setDefaultHeaders({'Authorization': 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1'});

  let User: any = JSON.parse(localStorage.getItem('user'));
  let Merchant: any = JSON.parse(localStorage.getItem('merchant'));
  let session: any = {};


  if (User == null || User == '') {
    session.user_id = '';
    session.mrcnt_id = '';
  }
  else {
    session.user_id = User.user_id;
    session.mrcnt_id = Merchant.mrcnt_id;
  }


  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params)=> {

    // console.log('session->' + JSON.stringify(session));
    params.user_id = session.user_id;
    params.mrcnt_id = session.mrcnt_id;
    return {
      params: params,
      headers: headers,
      element: element
    }
  });
}

//다국어, ng2-translate
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
