import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, Events } from 'ionic-angular';
import { replyModel, postModel } from '../../model/DataModels'
import { postsFirebaseService } from '../../providers/firebase-service/firebase-service'

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

  constructor(public navCtrl: NavController, public _Events: Events,  public viewCtrl:ViewController, public _postsFirebaseService:postsFirebaseService) {

    this.replyData.pharmacyName = ''
    this.replyData.details = 'لا توجد تعليقات بعد'
    this.replyData.price = ''
    this.replyData.pharmacyUid = localStorage.getItem('uid')
  }

  goBack(){
    this.viewCtrl.dismiss();
   }

  openCamera(){

  }

  onAddPost(){
    var date = new Date
    this.postData.comments.push(this.replyData)
    this.postData.uidUser = localStorage.getItem('uid')
    this.postData.postImg = ''
    this.postData.name = this.userData['name']
    this.postData.postDate = date.getDate() + "/" + (date.getMonth().valueOf()+1) + "/" + date.getFullYear()

    this._postsFirebaseService.addPosts(this.postData)

    this._Events.publish("post:Added")

    this.viewCtrl.dismiss();


  }

}
