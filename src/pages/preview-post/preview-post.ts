import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { replyModel, postModel, UserDataModel } from '../../model/DataModels'
import { postsFirebaseService, authFirebaseService } from '../../providers/firebase-service/firebase-service'
import { AngularFireList } from "angularfire2/database";
import { AngularFireDatabase } from 'angularfire2/database';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the PreviewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preview-post',
  templateUrl: 'preview-post.html',
})
export class PreviewPostPage {

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

  isUser: boolean = Boolean(JSON.parse(localStorage["userData"])[1]['userType'] == 'user')
  thePost = JSON.parse(localStorage["thePost"]);
  userData = JSON.parse(localStorage["userData"]);
  isCommentAvailable: Boolean = true
  postComments = []
  listComments: AngularFireList<any>

  constructor(public navCtrl: NavController, public db:AngularFireDatabase, public _ToastController:ToastController, public _authFirebaseService:authFirebaseService, public _LoadingController:LoadingController, public _Events:Events, public viewCtrl:ViewController, public _postsFirebaseService:postsFirebaseService) {

    this.postData = this.thePost[1]

    if (this.postData.comments.length == 1){
      this.postComments.push(this.postData.comments[0])
      this.isCommentAvailable = false
    }else{
      for (let i = 1; i < this.postData.comments.length; i++) {
        this.postComments.push(this.postData.comments[i])
      }
    }

  }

  goBack(){
    this.viewCtrl.dismiss();
   }

   onComment(){
    if (this.replyData.price.length < 1){
      this._ToastController.create({
        message: 'لا يمكنك ترك السعر فارغ',
        duration: 2000
      }).present()
    }else{
      var date = new Date
      this.replyData.pharmacyName = this.userData[1]['name']
      this.replyData.pharmacyKey = this.userData[2]
      let nowDay:String
      let nowMonth:String
      let nowHours:String
      let nowMinuts:String
      if (date.getDate() < 10){
        nowDay = String('0' + date.getDate())
      }else{nowDay = String(date.getDate())}
      if ((date.getMonth().valueOf()+1) < 10){
        nowMonth = String('0' + (date.getMonth().valueOf()+1))
      }else{nowMonth = String(((date.getMonth().valueOf()+1)))}
      if (date.getHours() < 10){
        nowHours = String('0' + (date.getHours()))
      }else{nowHours = String(date.getHours())}
      if (date.getMinutes() < 10){
        nowMinuts = String('0' + (date.getMinutes()))
      }else{nowMinuts = String(date.getMinutes())}
      this.replyData.date = nowDay + "/" + nowMonth + "/" + date.getFullYear() + '/' + nowHours + ':' + nowMinuts
      this.postData.comments.push(this.replyData)
      this._postsFirebaseService.updatePosts(this.thePost[0], this.postData)
  
  
      this.userData[1]['pharmacyReplyNo'] = Number(this.userData[1]['pharmacyReplyNo']) + 1
      this._authFirebaseService.editUserProfile(this.userData[2], this.userData[1])
      localStorage.setItem("userData", JSON.stringify(this.userData))
      
      this.viewCtrl.dismiss();
    }

   }

   openProfile(profileKey){
    let loading = this._LoadingController.create({
      spinner: "crescent",
      content: 'جارِ التحميل'
    });
    loading.present()
    
      console.log(profileKey);

      this.db.object("userData/" + profileKey).snapshotChanges().subscribe(action=>{
        let profileData = action.payload.val() as UserDataModel
        let userProfile = [
          [{}],
          profileData
        ]
        console.log(userProfile);
        localStorage.setItem("visitProfile", "true")
        this.navCtrl.push(ProfilePage, {userProfile})
        loading.dismiss() 
      });

    
   }
}
