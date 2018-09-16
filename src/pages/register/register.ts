import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Loading } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service';
import { TabsPage } from '../tabs/tabs';
import firebase from 'firebase';
import { AlertController,LoadingController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer'

// import { LoginPage} from '../login/login';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()

@Component({

  selector: 'page-register',

  templateUrl: 'register.html',

})

export class RegisterPage {

  userAuthData ={

    email:"",

    password:""
 }
  userInfoData ={

    name: '',

    province: '',

    zone: '',

    userType: '',

    pharmacyReplyNo: '0',

    pharmacyAdress: ''

  }
  myForm: FormGroup;

  userType="user";
  loader = this.loadingCtrl.create({
    content: "جار انشاء حساب",
    spinner: "crescent",
  })
  checkerLoader = this.loadingCtrl.create({
    content: "سيتم تسجيل دخولك بعد الضغط على الرابط",
    spinner: "crescent",
  })

  constructor(public navCtrl: NavController,

    public navParams: NavParams,

    public _authFirebaseService:authFirebaseService,

    public _Events:Events,

    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public _EmailComposer:EmailComposer
    ) {
  this.myForm = this.fb.group({
    password: new FormControl(null,Validators.compose([Validators.required,Validators.minLength(5)])),
    email: new FormControl(null, Validators.compose([ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
   name: new FormControl(null, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(20), Validators.pattern('[a-zA-Zأ-ي -]*')])),
   province: new FormControl(null,Validators.required),
   zone: new FormControl(null,Validators.required)
   

  })

}

  ionViewDidLoad() {

    console.log('ionViewDidLoad RegisterPage');
  }


  registerOn(){
    this.loader.present(); 
    this.userInfoData.userType=this.userType
    this._authFirebaseService.regesterWithEmail(this.userAuthData,this.userInfoData).then(()=>{
      this.loader.dismiss();
      firebase.auth().currentUser.sendEmailVerification();
      this.checkerLoader.present()
      this.alertCtrl.create({
        title: " تفحص صندوق بريدك",
        subTitle:" تم ارسال رابط التحقق الي الايميل الخاص بك  ",
        buttons: ['OK']
      })
      this._authFirebaseService.checkVerified(this.userAuthData)
    })
    this._Events.subscribe("auth:Success", ()=>{
      this.checkerLoader.dismiss()
      this.navCtrl.setRoot(TabsPage)
    })
  }
   
  
}
