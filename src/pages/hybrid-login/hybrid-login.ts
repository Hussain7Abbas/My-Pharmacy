import { Component } from '@angular/core';
import { IonicPage ,NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service'
import { TabsPage } from '../tabs/tabs';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
@Component({
  selector: 'page-hybrid-login',
  templateUrl: 'hybrid-login.html',
})
export class HybridLoginPage {

  userInfoData ={
    province: '',
    zone: '',
    userType: '',
    pharmacyReplyNo: '0',
    pharmacyAdress: 'لا يوجد عنوان بعد!'
}
myForm: FormGroup;
isFacebook = Boolean(this.params.get('loginType') == 'facebook')
hybridData = this.params.get('hybridData')

constructor(public navCtrl: NavController, public params: NavParams, public _ViewCtrl:ViewController, public _Events:Events, public _authFirebaseService:authFirebaseService,public fb: FormBuilder,) {
 console.log(this.hybridData);
this.myForm = this.fb.group({
 userType: new FormControl(null,Validators.required),
   province: new FormControl(null,Validators.required),
   zone: new FormControl(null,Validators.required)
})
}


goBack(){
this._ViewCtrl.dismiss();
}

facebookRegister(){
    this._authFirebaseService.registerFacebook(this.userInfoData, this.hybridData)
    this._Events.subscribe("auth:Success", ()=>{
        this._ViewCtrl.dismiss();
        this.navCtrl.setRoot(TabsPage)
    })
}

googleRegister(){
    this._authFirebaseService.registerGoogle(this.userInfoData, this.hybridData)
    this._Events.subscribe("auth:Success", ()=>{
        this._ViewCtrl.dismiss();
        this.navCtrl.setRoot(TabsPage)
    })
}

segment(userType){
    let userSegment = document.getElementById('user')
    let pharmacySegment = document.getElementById('pharmacy')
    let cameraSegment = document.getElementById('camera')

    if (userType == 'pharmacy'){
        userSegment.classList.remove('activeSegment')
        pharmacySegment.classList.add('activeSegment')
        cameraSegment.classList.add('visableCam')
        this.userInfoData.userType = userType
    }else{
        pharmacySegment.classList.remove('activeSegment')
        userSegment.classList.add('activeSegment')
        cameraSegment.classList.remove('visableCam')
        this.userInfoData.userType = userType
    }
}

}
