
import {Injectable} from "@angular/core";

@Injectable()

export class CommonUtilService {


  constructor(){
    console.log('loading common util service');
  }

  getNow(){

    let date = new Date();

    let year  = this.pad(date.getFullYear().toString(), 4);
    let month = this.pad(date.getMonth()+1 , 2);
    let day   = this.pad(date.getDate()        , 2);

    let hour  = this.pad(date.getHours()   , 2);
    let minute = this.pad(date.getMinutes()-1, 2);
    let second = this.pad(date.getSeconds(), 2);

    return year + month + day + hour + minute + second;
  }

  pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  }


  stringify(objMessage){
    if (objMessage == '') return '';
    else return JSON.stringify(objMessage);
  }


}
