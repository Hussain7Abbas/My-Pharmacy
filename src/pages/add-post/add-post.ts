import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, Events, ActionSheetController, LoadingController } from 'ionic-angular';
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
    pharmacyUid: '',
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

  userData = JSON.parse(localStorage["userData"]);

  saveLoading;
  currentImg;
  imgName =''
  imgURl = '../../assets/imgs/noImgAvailable.png'
  cameraDidOpened:boolean = false

  constructor(public navCtrl: NavController, public _LoadingController:LoadingController, public _Camera:Camera, public _ActionSheetController:ActionSheetController,  public _Events: Events,  public viewCtrl:ViewController, public _postsFirebaseService:postsFirebaseService) {

    this.replyData.pharmacyName = ''
    this.replyData.details = 'لا توجد تعليقات بعد'
    this.replyData.price = ''
    this.replyData.pharmacyUid = localStorage.getItem('uid')
  }

  goBack(){
    this.viewCtrl.dismiss();
   }

  imgActionSheet(){
    const actionSheet = this._ActionSheetController.create({
      title: 'حدد طريقة اختيار صورة الدواء',
      buttons: [
        {
          icon: 'images',
          text: 'المعرض',
          role: 'destructive',
          handler: () => {
            this.openGalary()
          }
        },
        {
          icon: 'md-camera',
          text: 'الكامرة',
          handler: () => {
            this.openCamera()
          }
        }
      ]
    });
    actionSheet.present();
  }

  openGalary(){

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
          this._Events.publish('img:Uploaded')
        })
      })
  }

  onAddPost(){
    let date = new Date

    this.saveLoading = this._LoadingController.create({
      spinner: "crescent",
      content: 'جارِ النشر'
    });
    this.saveLoading.present();
    if (this.cameraDidOpened) {
      this.imgName = localStorage.getItem('uid') + date.getDate() + (date.getMonth().valueOf()+1) + date.getMinutes() + date.getSeconds()
      this.imgUpload()
    }else{
      this._Events.publish('img:Uploaded')
    }
    this._Events.subscribe('img:Uploaded', ()=>{
      console.log("we start");
      this.postData.comments.push(this.replyData)
      this.postData.uidUser = localStorage.getItem('uid')
      this.postData.name = this.userData[1]['name']
      this.postData.postDate = date.getDate() + "/" + (date.getMonth().valueOf()+1) + "/" + date.getFullYear()
      this.postData.postImg = this.imgURl
      this._postsFirebaseService.addPosts(this.postData).then(()=>{
        this._Events.publish("post:Added")
        this.viewCtrl.dismiss();
        this.saveLoading.dismiss();
      })
    })
  }
}







// ??? ?? constructor

//     mySelectedPhoto;
//     loading;
//     currentPhoto ;
//     imgSource;

// //// ????? ?????



  
// takePhoto(){
//   const options: CameraOptions = {
//     targetHeight:200,
//     targetWidth:200,
//     destinationType : this.camera.DestinationType.DATA_URL,
//     encodingType:this.camera.EncodingType.JPEG,
//     mediaType: this.camera.MediaType.PICTURE,
//     sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
//   }
  
//   this.camera.getPicture(options).then((imageData) =>{
//       this.loading = this.loadingCtrl.create({
//           content: "Update photo wait ..."
//            });
//     this.loading.present();
//   this.mySelectedPhoto = this.dataURLtoBlob('data:image/jpeg;base64,'+imageData);
//       this.upload();
          
//           },(err)=>{
//       console.log(err);
//           });
  
  
//   }
  
      
      
//   dataURLtoBlob(myURL){
//       let binary = atob(myURL.split(',')[1]);
//   let array = [];
//   for (let i = 0 ; i < binary.length;i++){
//       array.push(binary.charCodeAt(i));
//   }
//       return new Blob([new Uint8Array(array)],{type:'image/jpeg'});
//   }    
      
      
//   upload(){
//   if(this.mySelectedPhoto){
//       var uploadTask = firebase.storage().ref().child('images/'+this.auth.auth.currentUser.email+".jpg");
//       var put = uploadTask.put(this.mySelectedPhoto);
//       put.then(this.onSuccess,this.onErrors);

//       var sub = this.db.list("users",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(data => {

//         uploadTask.getDownloadURL().then(url =>{
          
          
//           this.db.list("users").update(data[0].payload.key,{
//             image:url
//           }).then( ()=> {
            
 
//             var cont = this.db.list("vote",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(vdata => {

//               vdata.forEach(vimgs => {

//                 this.db.list("vote").update(vimgs.key,{
//                   image:url,
//                 }).then( ()=> {cont.unsubscribe()})

//               });

//             });

//           })

      
          
//         });


//       });
      
      
//   }
//   }    
      
//   onSuccess=(snapshot)=>{
//       this.currentPhoto = snapshot.downloadURL;

//       this.loading.dismiss();
//   } 
      
//   onErrors=(error)=>{

//       this.loading.dismiss();


//   }   
      
//   getMyURL(){
//       firebase.storage().ref().child('images/'+this.auth.auth.currentUser.email+".jpg").getDownloadURL().then((url)=>{
//           this.imgSource = url;
          
//           })
//   }
      
      