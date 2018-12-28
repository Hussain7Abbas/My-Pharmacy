import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service';
import { TabsPage } from '../tabs/tabs';
import firebase from 'firebase';
import {StartPage} from '../start/start';
import { Camera, CameraOptions } from "@ionic-native/camera";
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
    userType: 'user',
    pharmacyReplyNo: '0',
    pharmacyAdress: ''
  }

  myForm: FormGroup;

  loader = this.loadingCtrl.create({
    content: "جار انشاء حساب",
    spinner: "crescent",
  })

  checkerLoader = this.loadingCtrl.create({
    content: "ارسلنا رابط تأكيد للايميل الخاص بك، سيتم تسجيل دخولك بعد الضغط عليه",
    spinner: "crescent",
  })
  saveLoading;
  currentImg;
  imgName =''
  imgURl = '../../assets/imgs/noImgAvailable.png'
  oldImgURL
  cameraDidOpened:boolean = false

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              public _authFirebaseService:authFirebaseService,
              public _Events:Events,
              public fb: FormBuilder,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public _Camera:Camera){

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


  onRegister(){
    if (this.userInfoData.userType == 'pharmacy'){
      if (this.cameraDidOpened) {
        this.loader.present(); 
        this.imgName = localStorage.getItem('uid')
        this.imgUpload()
      } else{
      const alert= this.alertCtrl.create({
          title: 'لم تقم بارفاق الترخيص',
          subTitle: 'يرجى التقاط صورة لترخيص وزارة الصحة لصيدليتك.',
          buttons: ['موافق']
        });
        alert.present();
       }
    } else {
      this.loader.present(); 
      this.registerOn()
    }
  }



  registerOn(){
    
    this._authFirebaseService.regesterWithEmail(this.userAuthData,this.userInfoData).then(()=>{
      this.loader.dismiss();
      firebase.auth().currentUser.sendEmailVerification();
      this.checkerLoader.present()
      this._authFirebaseService.checkVerified(this.userAuthData)
    }).then(()=>{
    this._Events.subscribe("auth:Success", ()=>{
      this.checkerLoader.dismiss();
      this.navCtrl.setRoot(TabsPage)
    })
    }).catch(error=>{
        const email_already_in_use = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "الايميل مسجل به مسبقا",
          buttons: ['موافق']
        });
          
        const weak_password = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "كلمة المرور ضعيفة",
          buttons: ['موافق']
        });
        const invalid_email = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "الايميل غير صالح ",
          buttons: ['موافق']
        });
        const network_error = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "خطأ في الاتصال في الانترنيت",
          buttons: ['موافق']
        });
        const user_not_found = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "لا يوجد حساب",
          buttons: ['موافق']
        });
        if (error.code=="auth/email-already-in-use") {
          email_already_in_use.present();
          this.checkerLoader.dismiss();
          this.loader.dismiss();
        }
        if (error.code=="auth/weak-password") {
          weak_password.present();
          this.checkerLoader.dismiss();
          this.loader.dismiss();
        }
        if (error.code=="auth/invalid-email") {
          invalid_email.present();
          this.checkerLoader.dismiss();
          this.loader.dismiss();
      }
      if (error.code=="auth/user-not-found") {
        user_not_found.present();
        this.checkerLoader.dismiss();
        this.loader.dismiss();
      }
      if (error.code=="auth/network-request-failed") {
        network_error.present();
        this.checkerLoader.dismiss();
        this.loader.dismiss();
      }          
    })
  }

  openCamera(){
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 720,
      targetWidth: 720,
      destinationType: this._Camera.DestinationType.DATA_URL,
      encodingType: this._Camera.EncodingType.JPEG,
      mediaType: this._Camera.MediaType.PICTURE
    }
    this._Camera.getPicture(options).then((imageData) => {
    this.currentImg = `data:image/jpeg;base64,${imageData}`
    this.cameraDidOpened = true
    }, (err) => {
      console.log(err);
    });
  }

  imgUpload(){
    const uploadTask = firebase.storage().ref("pharmacyImages/" + this.imgName + ".jpg")
    uploadTask.putString(this.currentImg, 'data_url').then(()=>{
      uploadTask.getDownloadURL().then((url)=>{
        this._authFirebaseService.pushPharmacyList(this.userInfoData.name, url)
      })
    }).then(()=>{
      this.registerOn()
    })
  }


  segment(userType){
    let userSegment = document.getElementById('user')
    let pharmacySegment = document.getElementById('pharmacy')
    let cameraSegment = document.getElementById('camera')
    if (userType == 'pharmacy'){
        cameraSegment.style.display = 'block'
        userSegment.classList.remove('activeSegment')
        pharmacySegment.classList.add('activeSegment')
        this.userInfoData.userType = userType
    }else{
      pharmacySegment.classList.remove('activeSegment')
      userSegment.classList.add('activeSegment')
      cameraSegment.style.display = 'none'
        this.userInfoData.userType = userType
    }
  }

  goBack(){
    this.navCtrl.push(StartPage)
  }
 

}
