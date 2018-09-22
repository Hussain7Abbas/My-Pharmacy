import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController, ModalController} from 'ionic-angular';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service'
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { HybridLoginPage } from "../hybrid-login/hybrid-login";
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
    pharmacyAdress: 'لا يوجد عنوان بعد!'
  }


  loader = this.loadingCtrl.create({
    content: "جارٍ التسجيل ...",
    spinner: "crescent",
  })


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public _authFirebaseService:authFirebaseService,
    public _Events:Events,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public _ModalController: ModalController
    ) {
     
  }

  ionViewDidLoad() {

  }
   //--------------------------------------login with Email--------------------------------------------
  // onLogin(AuthData){
    onLogin(){
  
      console.log(this.userAuthData)
      
      this._authFirebaseService.loginWithEmail(this.userAuthData)
        this._Events.subscribe("auth:Success", ()=>{
          this.navCtrl.setRoot(TabsPage)
      })

  }
  //--------------------------------------login with faceboook-----------------------------------------------
  logInFacebook(){
    this.loader.present();
    this._authFirebaseService.loginWithFacebook()
    this._Events.subscribe('go:Register_Facebook', (hybridData)=>{
      setTimeout(() => {
        this.loader.dismiss();
        this._ModalController.create(HybridLoginPage, {loginType: 'facebook', hybridData: hybridData}).present()
      }, 1000);
    })
    this._Events.subscribe('auth:Success', ()=>{
      this.loader.dismiss();
      this.navCtrl.setRoot(TabsPage)
    })
  } 
    //--------------------------------------login with Google-----------------------------------------------
  logInGoogle(){
    this.loader.present();
    this._authFirebaseService.loginWithGoogle()
    this._Events.subscribe('go:Register_Google', (hybridData)=>{
      setTimeout(() => {
        this.loader.dismiss();
        this._ModalController.create(HybridLoginPage, {loginType: 'google', hybridData: hybridData}).present()
      }, 1000);
    })
    this._Events.subscribe('auth:Success', ()=>{
      this.loader.dismiss();
      this.navCtrl.setRoot(TabsPage)
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

  goBack(){
    this.navCtrl.pop()
  }


  moreDetails(){
    let moreDetails = document.getElementById('moreDetails')
    let moreDetBtn = document.getElementById('detRotate')
    let promo = document.getElementById('promo')


    if (moreDetails.style.display === 'none'){
      moreDetails.style.display = 'block'
      moreDetBtn.style.transform = 'rotate(-180deg)'
      promo.style.display = 'none'
    }else{
      moreDetails.style.display = 'none'
      moreDetBtn.style.transform = 'rotate(0deg)'
      promo.style.display = 'block'
    }

  }

}