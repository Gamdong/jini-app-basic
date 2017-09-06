/**
 * Created by COM on 2017-08-07.
 */

import {Injectable} from "@angular/core";

@Injectable()

export class StorageService {

  constructor() {


  }

  // 저장
  save = (key: string, params)=>{

    let data = JSON.stringify(params);
    localStorage.setItem(key, data);
  }

  //불러오기
  load = (key: string)=>{

    let data = JSON.parse(localStorage.getItem(key));
    return data;
  }

  // 모든 저장값 삭제
  removeAll = (key: string)=> {

    localStorage.removeItem(key); // TODO: 확인 필요
  }

  // 특정값 삭제
  remove = (key: string, indexes: number[])=> {

    let data = JSON.parse(localStorage.getItem(key));
    if (data == null || data == '') return;

    let newData: object[];
    for (let i:number = 0; i<data.length; i++){
      newData.push()
    }

    this.save(key, newData);
  }
}
