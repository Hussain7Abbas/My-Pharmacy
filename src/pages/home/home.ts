import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Events, ToastController, Content, LoadingController } from 'ionic-angular';
import { AddPostPage } from '../add-post/add-post'
import { PreviewPostPage } from '../preview-post/preview-post'
import { postsFirebaseService } from '../../providers/firebase-service/firebase-service'
import { AngularFireDatabase } from "angularfire2/database"; 
import { postModel } from '../../model/DataModels'
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  postData:postModel = {
    name: '',
    uidUser: '',
    postBody: '',
    postImg: '',
    postDate: '',
    signalId: '',
    comments: []
  }
  
  // check the user type (user = true , pharmacy = false)
  isUser: boolean = Boolean(JSON.parse(localStorage["userData"])[1]['userType'] == 'user')
  @ViewChild(Content) content: Content;
  
  postsRef = this.db.database.ref("Posts")
  myObject = []
  myLimit = 0
  myListCount = 0

  constructor(public navCtrl: NavController, public _LoadingController:LoadingController, public _ToastController:ToastController, public _Events: Events, public modalCtrl: ModalController, public _postsFirebaseService:postsFirebaseService, public db:AngularFireDatabase) {
    localStorage.setItem('navTitle', 'الرئيسية') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
    this.postsRef.once('value', action => {this.myListCount = Object.entries(action.val()).length})
    // Call "Load data" function to set data into "myObject" array
    this.setData()

  }

  // get Data from firebase into "myObject" array
  setData(){
      let loading = this._LoadingController.create({
        spinner: "crescent",
        content: 'يرجى الانتظار'
      });
      loading.present();
      this.myObject = []
      this.myLimit += 10
      
      this.postsRef = this.db.database.ref("Posts")
      this.postsRef.limitToLast(this.myLimit).once('value', action => {
        for (let post in action.val()) {
          this.myObject.push([
            post,
            action.val()[post] as postModel
          ])
        }
      }).then(()=>{
        loading.dismiss();
      })
  }

  goAddQues(){
    // open addPost page as a modal
    let addPostModal = this.modalCtrl.create(AddPostPage);
    addPostModal.present();
    // Refresh data when the post has bening added
    this._Events.subscribe("post:Added", ()=>{
      const toast = this._ToastController.create({
        message: 'تم نشر المنشور',
        duration: 2000
      });
      toast.present();
      this.navCtrl.setRoot(TabsPage)
    })
  }

  goPreviewQues(Post){
    // open previewPost page as a modal
    let PreviewPostModal = this.modalCtrl.create(PreviewPostPage);
    PreviewPostModal.present();
    // pass post data to previewPost page
    localStorage.setItem("thePost", JSON.stringify(Post));
  }

// ionic refresher function
  doRefresh(refresher) {
    setTimeout(() => {
      this.navCtrl.setRoot(TabsPage)
      refresher.complete();
    }, 2000);
  }

// ionic infinity scroll function
  doInfinite(infiniteScroll) {
    if (this.myLimit > this.myListCount){
      // console.log();
      

      setTimeout(() => {
        // this.content.scrollTo(0, this.content.scrollHeight - 63, 300);
        const toast = this._ToastController.create({
          message: 'لا توجد المزيد من المنشورات',
          duration: 2000,
          position: 'middle'
        });
        toast.present();
        infiniteScroll.complete();
      }, 1000); 

    }else if (this.myLimit < this.myListCount){
      setTimeout(() => {
        this.setData()
        infiniteScroll.complete();
      }, 500);    
    }

  }

}