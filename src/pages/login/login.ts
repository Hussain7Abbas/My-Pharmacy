import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service'
import { TabsPage } from '../tabs/tabs';

import firebase from 'firebase';
import { RegisterPage } from '../register/register';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userAuthData ={
    email:'',
    password:''
  }
  userInfoData ={
    name: '',
    province: '',
    zone: '',
    userType: '',
    pharmacyReplyNo: '0',
    pharmacyAdress: ' '
  }
 
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public _authFirebaseService:authFirebaseService,
    public _Events:Events
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
   //--------------------------------------login with Email--------------------------------------------
  onLogin(AuthData){
    console.log(this.userAuthData)
    this._authFirebaseService.loginWithEmail(this.userAuthData)
      this._Events.subscribe("auth:Success", ()=>{
          this.navCtrl.setRoot(TabsPage)
    })
  }
  //--------------------------------------login with faceboook-----------------------------------------------
    logInFacebook(){
   this._authFirebaseService.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
   .then(res => {
     console.log(res);
   })
  } 
    //--------------------------------------login with Google-----------------------------------------------
  logInGoogle(){
    this._authFirebaseService.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(res => {
      console.log(res);
  })
  }
  registerOn(){
    this.navCtrl.setRoot(RegisterPage)
  }
}
