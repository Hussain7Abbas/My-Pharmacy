import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, Events, ActionSheetController, LoadingController, NavParams } from 'ionic-angular';
import { replyModel, postModel } from '../../model/DataModels'
import { postsFirebaseService } from '../../providers/firebase-service/firebase-service'
import { Camera, CameraOptions } from "@ionic-native/camera";
import * as firebase from 'firebase'

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

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

  editPostData = JSON.parse(localStorage["thePost"]);

  userData = JSON.parse(localStorage["userData"]);

  saveLoading;
  currentImg;
  imgName =''
  imgURl = '../../assets/imgs/noImgAvailable.png'
  oldImgURL
  cameraDidOpened:boolean = false

  constructor(public navCtrl: NavController, public _LoadingController:LoadingController, public _Camera:Camera, public _ActionSheetController:ActionSheetController,  public _Events: Events,  public viewCtrl:ViewController, public _postsFirebaseService:postsFirebaseService) {

    this.replyData.pharmacyName = ''
    this.replyData.details = 'لا توجد تعليقات بعد'
    this.replyData.price = ''
    this.replyData.pharmacyKey = localStorage.getItem('uid')

    if (localStorage.getItem('editPost')){
      
      console.log(this.editPostData);
      this.postData = this.editPostData[1]
      this.imgURl, this.oldImgURL = this.postData.postImg
    }

  }

  goBack(){
    this.viewCtrl.dismiss();
   }

  // imgActionSheet(){
  //   const actionSheet = this._ActionSheetController.create({
  //     title: 'حدد طريقة اختيار صورة الدواء',
  //     buttons: [
  //       {
  //         icon: 'images',
  //         text: 'المعرض',
  //         role: 'destructive',
  //         handler: () => {
  //           this.openGalary()
  //         }
  //       },
  //       {
  //         icon: 'md-camera',
  //         text: 'الكامرة',
  //         handler: () => {
  //           this.openCamera()
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

  // openGalary(){

  // }

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
          if (localStorage.getItem('editPost')){
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
            this.postData.postDate = date.getDate() + "/" + (date.getMonth().valueOf()+1) + "/" + date.getFullYear()
            this.postData.postImg = this.imgURl
            this._postsFirebaseService.addPosts(this.postData).then(()=>{
              this._Events.publish("post:Added")
              this.viewCtrl.dismiss();
              this.saveLoading.dismiss();
            })
          }

        })
      })
  }

  onAddPost(){
    let date = new Date
    if (localStorage.getItem('editPost')){
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
        this.postData.postDate = date.getDate() + "/" + (date.getMonth().valueOf()+1) + "/" + date.getFullYear()
        this.postData.postImg = this.imgURl
        this._postsFirebaseService.addPosts(this.postData).then(()=>{
          this._Events.publish("post:Added")
          this.viewCtrl.dismiss();
          this.saveLoading.dismiss();
        })      
      }
    }
  }
}
