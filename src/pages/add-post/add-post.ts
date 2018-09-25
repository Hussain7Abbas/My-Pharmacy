import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, Events, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { replyModel, postModel } from '../../model/DataModels'
import { postsFirebaseService } from '../../providers/firebase-service/firebase-service'
import { Camera, CameraOptions } from "@ionic-native/camera";
import * as firebase from 'firebase'
import { OneSignal } from "@ionic-native/onesignal";
import {Http ,Headers} from '@angular/http'
@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  headers:any
  replyData:replyModel = {
    pharmacyName: '',
    pharmacyKey: '',
    date: '',
    price: '',
    details: ''
  }

  postData:postModel = {
    name: '',
    uidUser: '',
    postBody: '',
    postImg: '',
    postDate: '',
    comments: []
  }

  editPostData

  userData = JSON.parse(localStorage["userData"]);

  isEdit:boolean = Boolean(localStorage.getItem('editPost') == 'true')
  saveLoading;
  currentImg;
  imgName =''
  imgURl = '../../assets/imgs/noImgAvailable.png'
  oldImgURL
  cameraDidOpened:boolean = false

  constructor(public http:Http,public navCtrl: NavController, public _OneSignal:OneSignal, public _ToastController:ToastController, public _LoadingController:LoadingController, public _Camera:Camera, public _ActionSheetController:ActionSheetController,  public _Events: Events,  public viewCtrl:ViewController, public _postsFirebaseService:postsFirebaseService) {

    this.replyData.pharmacyName = ''
    this.replyData.details = 'لا توجد تعليقات بعد'
    this.replyData.price = ''
    this.replyData.pharmacyKey = localStorage.getItem('uid')

    if (this.isEdit){
      this.editPostData = JSON.parse(localStorage["thePost"]);
      console.log(this.editPostData);
      this.postData = this.editPostData[1]
      this.imgURl, this.oldImgURL = this.postData.postImg
    }

  }

  goBack(){
    this.viewCtrl.dismiss();
    localStorage.setItem('editPost', 'false')
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
      const uploadTask = firebase.storage().ref("postsImages/" + this.imgName + ".jpg")
      uploadTask.putString(this.currentImg, 'data_url').then(()=>{
        uploadTask.getDownloadURL().then((url)=>{
          this.imgURl = url

          let date = new Date
          if (this.isEdit){
            this.postData.postImg = this.imgURl
            this.editPostData[1] = this.postData
            this._postsFirebaseService.updatePosts(this.editPostData[0], this.editPostData[1]).then(()=>{
            // Create a reference to the file to delete
            var desertRef = firebase.storage().refFromURL(this.oldImgURL);
            // Delete the file
            desertRef.delete().then(function() {
              console.log('img_deleted');
            }).catch(function(err) {
              
              alert('حدث خطأ' + err)
            });
              this._Events.publish("post:Edit")
              this.viewCtrl.dismiss();
              this.saveLoading.dismiss();
            })
          }else{
            this.postData.comments.push(this.replyData)
            this.postData.uidUser = localStorage.getItem("uid")
            this.postData.name = this.userData[1]['name']
            let nowDay:String
            let nowMonth:String
            if (date.getDate() < 10){
              nowDay = String('0' + date.getDate())
            }else{nowDay = String(date.getDate())}
            if ((date.getMonth().valueOf()+1) < 10){
              nowMonth = String('0' + (date.getMonth().valueOf()+1))
            }else{nowMonth = String(((date.getMonth().valueOf()+1)))}
            this.postData.postDate = nowDay + "/" + nowMonth + "/" + date.getFullYear()
            this.postData.postImg = this.imgURl
            this._postsFirebaseService.addPosts(this.postData).then(()=>{
              this._Events.publish("post:Added")
              this.viewCtrl.dismiss();
              this.saveLoading.dismiss();
           
this.postNotification();
alert('تم ارسال الى الصيدليات')
           
            })
          }

        })
      })
  }

  onAddPost(){
    if (this.postData.postBody.length < 3){
      this._ToastController.create({})
      const toast = this._ToastController.create({
        message: 'الرجاء كتابة اسم الدواء بشكل صحيح.',
        duration: 2000
      });
      toast.present();
    }else{
      let date = new Date
      if (this.isEdit){
        this.saveLoading = this._LoadingController.create({
          spinner: "crescent",
          content: 'جارِ حفظ التعديلات'
        });
        this.saveLoading.present();
        if (this.cameraDidOpened) {
          this.imgName = localStorage.getItem('uid') + date.getDate() + (date.getMonth().valueOf()+1) + date.getMinutes() + date.getSeconds()
          this.imgUpload()
        }else{
          this.postData.postImg = this.imgURl
          this.editPostData[1] = this.postData
          this._postsFirebaseService.updatePosts(this.editPostData[0], this.editPostData[1]).then(()=>{
            this._Events.publish("post:Edit")
            this.viewCtrl.dismiss();
            this.saveLoading.dismiss();
          })
        }
      }else{
        this.saveLoading = this._LoadingController.create({
          spinner: "crescent",
          content: 'جارِ النشر'
        });
        this.saveLoading.present();
        if (this.cameraDidOpened) {
          this.imgName = localStorage.getItem('uid') + date.getDate() + (date.getMonth().valueOf()+1) + date.getMinutes() + date.getSeconds()
          this.imgUpload()
        }else{
          this.postData.comments.push(this.replyData)
          this.postData.uidUser = localStorage.getItem("uid")
          this.postData.name = this.userData[1]['name']
          let nowDay:String
          let nowMonth:String
          if (date.getDate() < 10){
            nowDay = String('0' + date.getDate())
          }else{nowDay = String(date.getDate())}
          if ((date.getMonth().valueOf()+1) < 10){
            nowMonth = String('0' + (date.getMonth().valueOf()+1))
          }else{nowMonth = String(((date.getMonth().valueOf()+1)))}
          this.postData.postDate = nowDay + "/" + nowMonth + "/" + date.getFullYear()
          this.postData.postImg = this.imgURl
          this._postsFirebaseService.addPosts(this.postData).then(()=>{
            this._Events.publish("post:Added")
            this.viewCtrl.dismiss();
            this.saveLoading.dismiss();

            this.postNotification();

        
            alert('تم ارسال الى الصيدليات')



          })      
        }
      }
    }

  }
  postNotification(){
    let  headers = new Headers();
    headers.append('Content-Type','application/json;');
    headers.append('Authorization','Basic ZGEwYzJiMjktZWEwNy00M2Q3LWIyMzItNzhjNjczNjRlNjQw');
   let body={
    "app_id":"e2304606-4ab1-4f9d-a0ea-1c83518b62af",
    "included_segments": ['pharmacySegment'],
    "data":{'foo':'bar'},
    "contents": {
      en: "رسالة الى صيدلية"
    },
    headings: {
      en: "تطبيق صيدليتي"
    }
  };
  this.http.post('https://onesignal.com/api/v1/notifications',JSON.stringify(body),{headers:headers}).map(res=>res.json()
  ).subscribe(data=>{
    console.log(data)
  })
  }




}
