import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service';
import { TabsPage } from '../tabs/tabs';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { AlertController,LoadingController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,

    public navParams: NavParams,

    public _authFirebaseService:authFirebaseService,

    public _Events:Events,

    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
    ) {
  this.myForm = this.fb.group({
    password: new FormControl(null,Validators.compose([Validators.required,Validators.minLength(5)])),
    email: new FormControl(null, Validators.compose([ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
   name: new FormControl(null, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(30), Validators.pattern('[a-zA-Z]*')])),
   province: new FormControl(null,Validators.required),
   zone: new FormControl(null,Validators.required)
   

  })
}

  ionViewDidLoad() {

    console.log('ionViewDidLoad RegisterPage');
  }


   registerOn(){
   
       try {
         
       
    this.userInfoData.userType=this.userType
    this._authFirebaseService.regesterWithEmail(this.userAuthData,this.userInfoData)
    this._Events.subscribe("auth:Success", ()=>{
      this.navCtrl.setRoot(TabsPage)
    
    
    })
  
}
   catch (error) {
  //   const email_already_in_use = this.alertCtrl.create({
  //     title: "خطاء",
  //     subTitle: "الاميل موجود مسبقا",
  //     buttons: ['موافق']
  //   });
      
    
  //   const weak_password = this.alertCtrl.create({
  //     title: "خطاء",
  //     subTitle: "كلمة المرور ضعيفة",
  //     buttons: ['موافق']
  //   });
  //   const invalid_email = this.alertCtrl.create({
  //     title: "خطاء",
  //     subTitle: "الايميل غير صالح ",
  //     buttons: ['موافق']
  //   });

  //   if (error.code=="auth/email-already-in-use") { 
  //   email_already_in_use.present();
  //   }
  //   if (error.code=="auth/weak-password") {
  //     weak_password.present();
  //   }
  //   if (error.code=="auth/invalid-email") {
  //     invalid_email.present();
    
  // }
  
     
   
      
  }
  
   
   }
  
  

  }
 
