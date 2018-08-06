import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ViewController } from 'ionic-angular';
import { replyModel, postModel } from '../../model/DataModels'
import { postsFirebaseService } from '../../providers/firebase-service/firebase-service'
import { AngularFireList } from "angularfire2/database"; 

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

  isUser: boolean = Boolean(JSON.parse(localStorage["userData"])['userType'] == 'user')
  thePost = JSON.parse(localStorage["thePost"]);
  userData = JSON.parse(localStorage["userData"]);
  isCommentAvailable: Boolean = true
  postComments = []
  listComments: AngularFireList<any>

  constructor(public navCtrl: NavController, public viewCtrl:ViewController, public _postsFirebaseService:postsFirebaseService) {

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
    var date = new Date
    this.replyData.pharmacyName = this.userData['name']
    this.replyData.pharmacyUid = localStorage.getItem('uid')
    this.replyData.date = date.getDate() + "/" + (date.getMonth().valueOf()+1) + "/" + date.getFullYear()
    this.postData.comments.push(this.replyData)
    this._postsFirebaseService.updatePosts(this.postData,this.thePost[0])
    
    this.viewCtrl.dismiss();
   }

}
