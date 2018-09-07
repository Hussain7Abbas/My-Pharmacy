import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController} from 'ionic-angular';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service'
import { TabsPage } from '../tabs/tabs';

import firebase, { database } from 'firebase';
import { RegisterPage } from '../register/register';
import { Message } from '../../../node_modules/@angular/compiler/src/i18n/i18n_ast';
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
    pharmacyAdress: ''
  }

 
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public _authFirebaseService:authFirebaseService,
    public _Events:Events,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
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
   this._authFirebaseService.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())
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
  //-----------------------------forget password-------------
  forgetPassword(){
    let prompt = this.alertCtrl.create({
      title: 'ادخل الايميل الخاص بك ',
      message: "سوف يتم ارسال كلمة السر الجديدة الخاصة بك",
      inputs: [
        {
          name: 'recoverEmail',
          placeholder: 'you@example.com'
        },
      ],
      buttons: [
        {
          text: 'الغاء',
          handler: data => {
            console.log('ضغطت على الالغاء');
          }
        },
        {
          text: 'ارسال',
          handler: data => {
           //---------------------------add preloader---------------------------------
           //presentLoadingDefault() {
            let loading = this.loadingCtrl.create({
              dismissOnPageChange: true,
              content: 'استعادة كلمة المرور...'
            });
            //------------------------use usersservice
           // console.log('رسالة قصيرة ارسلت '+ data.recoverEmail);
          loading.present();
         this._authFirebaseService.forgetPasswordUser(data.recoverEmail).then(() =>{
// 
loading.dismiss().then(() => {
  let alert = this.alertCtrl.create({
    title: " تفحص صندوق بريدك",
    subTitle:" تم اعادة كلمة المرور بنجاح ",
    buttons: ['OK']
  });
alert.present();
})
         }, error => {
       
           // alert ("error reset password in"+ error.message);
loading.dismiss().then(() => {
  let alert = this.alertCtrl.create({
    title: "خطا في استعادة كلمة المرور ",
    // subTitle: error.message ,
    subTitle:"يرجى اعادة المحاولة ",
    buttons: ['OK']
  });
alert.present();
})
         });
          }
        }
      ]
    });
    prompt.present();
  }

}
