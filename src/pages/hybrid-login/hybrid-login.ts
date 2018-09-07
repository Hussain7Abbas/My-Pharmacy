import { Component } from '@angular/core';
import { IonicPage ,NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service'
import { TabsPage } from '../tabs/tabs';


@IonicPage()
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

userType = "user";
loginType = Boolean(this.navParams.get('loginType') == 'facebook')

constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, public _Events:Events, public _authFirebaseService:authFirebaseService) {

}

goBack(){
this.viewCtrl.dismiss();
}

// facebookLogin(){
//     if (this.userType == 'user'){
//         this._authFirebaseService.loginWithFacebook(this.userInfoData)
//         this._Events.subscribe("auth:Success", ()=>{
//             this.viewCtrl.dismiss();
//             this.navCtrl.setRoot(TabsPage)
//         })
//     }else{
//         this._authFirebaseService.facebookPharmacy(this.userInfoData)
//     }
// }

// googleLogin(){
//     if (this.userType == 'user'){
//         this._authFirebaseService.googlePharmacy(this.userInfoData)
//         this._Events.subscribe("auth:Success", ()=>{
//             this.viewCtrl.dismiss();
//             this.navCtrl.setRoot(TabsPage)
//         })
//     }else{
//         this._authFirebaseService.googlePharmacy(this.userInfoData)
//     }
// }

}
