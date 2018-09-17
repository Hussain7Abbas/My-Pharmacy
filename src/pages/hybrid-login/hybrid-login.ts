import { Component } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service'
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import firebase from 'firebase';
import { Camera, CameraOptions } from "@ionic-native/camera";

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

    currentImg;
    imgName =''
    imgURl = '../../assets/imgs/noImgAvailable.png'
    oldImgURL
    cameraDidOpened:boolean = false

constructor(public navCtrl: NavController, public params: NavParams, public _Camera:Camera, public _ViewCtrl:ViewController, public _Events:Events, public _authFirebaseService:authFirebaseService,public fb: FormBuilder,) {
    console.log(this.hybridData);
    this.myForm = this.fb.group({
    province: new FormControl(null,Validators.required),
    zone: new FormControl(null,Validators.required)
})
}


goBack(){
this._ViewCtrl.dismiss();
}

facebookRegister(){
    if (this.cameraDidOpened) {
        let date = new Date
        this.imgName = localStorage.getItem('uid') + date.getDate() + (date.getMonth().valueOf()+1) + date.getMinutes() + date.getSeconds()
        this.imgUpload()
    }
    this._authFirebaseService.registerFacebook(this.userInfoData, this.hybridData)
    this._Events.subscribe("auth:Success", ()=>{
        this._ViewCtrl.dismiss();
        // this.navCtrl.setRoot(TabsPage)
    })
}

googleRegister(){
    if (this.cameraDidOpened) {
        let date = new Date
        this.imgName = localStorage.getItem('uid') + date.getDate() + (date.getMonth().valueOf()+1) + date.getMinutes() + date.getSeconds()
        this.imgUpload()
    }
    this._authFirebaseService.registerGoogle(this.userInfoData, this.hybridData)
    this._Events.subscribe("auth:Success", ()=>{
        this._ViewCtrl.dismiss();
        // this.navCtrl.setRoot(TabsPage)
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
        this._authFirebaseService.pushPharmacyList(this.hybridData['name'], url)
      })
    })
  }

}
