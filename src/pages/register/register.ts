import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service';
import { TabsPage } from '../tabs/tabs';
import firebase from 'firebase';
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
    userType: '',
    pharmacyReplyNo: '0',
    pharmacyAdress: ''
  }

  myForm: FormGroup;

  loader = this.loadingCtrl.create({
    content: "جار انشاء حساب",
    spinner: "crescent",
  })

  checkerLoader = this.loadingCtrl.create({
    content: "سيتم تسجيل دخولك بعد الضغط على الرابط",
    spinner: "crescent",
  })

  saveLoading;
  currentImg;
  imgName =''
  imgURl = '../../assets/imgs/noImgAvailable.png'
  oldImgURL
  cameraDidOpened:boolean = false

  constructor(public navCtrl: NavController,
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
    this.loader.present(); 
    if (this.userInfoData.userType == 'pharmacy'){
      if (this.cameraDidOpened) {
        let date = new Date
        this.imgName = localStorage.getItem('uid') + date.getDate() + (date.getMonth().valueOf()+1) + date.getMinutes() + date.getSeconds()
        this.imgUpload()
      }else{
        this.alertCtrl.create({
          title: 'لم تقم بارفاق الترخيص',
          subTitle: 'يرجى التقاط صورة لترخيص وزارة الصحة لصيدليتك.'
        })
      }
    }else{
      this.registerOn()
    }
    
  }



  registerOn(){
    this._authFirebaseService.regesterWithEmail(this.userAuthData,this.userInfoData).then(()=>{
      this.loader.dismiss();
      // firebase.auth().currentUser.sendEmailVerification();
      // this.checkerLoader.present()
      // this.alertCtrl.create({
      //   title: "تفحص صندوق بريدك الالكتروني",
      //   subTitle:"رجائاً ثم بالضغط على الرابط الذي تم ارساله الى بريدك الالكتروني لتأكيد حسابك",
      //   buttons: ['OK']
      // })
      // this._authFirebaseService.checkVerified(this.userAuthData)
    })
    this._Events.subscribe("auth:Success", ()=>{
      // this.checkerLoader.dismiss()
      this.navCtrl.setRoot(TabsPage)
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
    this.navCtrl.pop()
  }
  
}
