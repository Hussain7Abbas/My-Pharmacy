import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';
import { LoginPage } from '../login/login'
import { AddPostPage } from '../add-post/add-post'
import { PreviewPostPage } from '../preview-post/preview-post'
import { postsFirebaseService } from '../../providers/firebase-service/firebase-service'
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { postModel } from '../../model/DataModels'

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
    comments: []
  }
  
  isUser: boolean = Boolean(JSON.parse(localStorage["userData"])['userType'] == 'user')

  postList:AngularFireObject<any>
  
  itemArray = []
  myObject = []

  constructor(public navCtrl: NavController, public _Events: Events, public modalCtrl: ModalController, public _postsFirebaseService:postsFirebaseService, public db:AngularFireDatabase) {
    localStorage.setItem('navTitle', 'الرئيسية') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار

    this.postList = this.db.object('Posts')


    this.loadData()

  }



  toPage(){
    this.navCtrl.push(LoginPage)
  }

  setData(){
    this.myObject = []
    this.postList.snapshotChanges().subscribe(action=>{
      if (action.payload.val() == null || action.payload.val() == undefined) {
        alert('No Data')
      } else {
        this.itemArray.push(action.payload.val() as postModel)
        this.myObject = Object.entries(this.itemArray[0])
      }
  })
  }


  loadData(){
    this.myObject = []
    this.setData()
  }

  // onEdit(myList){
  //   this._FirebaseServiceProvider.updatePosts(myList)
  // }

  // onDelete(key){
  //   this._postsFirebaseService.deletePosts(key)
  //   this.myfilter = []
  //   this.setData()
  // }

  goAddQues(){
    let addPostModal = this.modalCtrl.create(AddPostPage);
    addPostModal.present();

    // setTimeout(() => {
    //   if (localStorage.getItem('reloadHome') == 'reload'){
    //     this.loadData()
    //     console.log('Loaded');
        
    //     localStorage.setItem('reloadHome', 'none')
    //   }else if (localStorage.getItem('reloadHome') == 'close'){
    //     localStorage.setItem('reloadHome', 'none')
    //   }else{
    //     console.log('nothing');
        
    //   }
    // }, 1000);
  }

  goPreviewQues(Post){
    let PreviewPostModal = this.modalCtrl.create(PreviewPostPage);
    PreviewPostModal.present();
    
    localStorage.setItem("thePost", JSON.stringify(Post));

  }

}