import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database"; 
import { postModel, UserDataModel } from '../../model/DataModels';
import { PreviewPostPage } from '../preview-post/preview-post';
import { ProfilePage } from "../profile/profile";



/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchType = 'post'
  searchWord = ''
  isResults:Boolean = true

  postsRef = this.db.database.ref("Posts")
  myObject = []
  searchList = []

  myLimit = 0
  myListCount = 0


  constructor(public navCtrl: NavController, public _loadingCtrl:LoadingController, public modalCtrl:ModalController, public _ToastController:ToastController, public db:AngularFireDatabase, public navParams: NavParams) {
    this.setDataPost()
  
    localStorage.setItem('navTitle', 'بحث') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  

  onSwitch(){
    if (this.searchType == 'post'){
      this.setDataPost()
    }else{
      this.setDataPharmacy()
    }
  }

  setDataPost(){
    const searchLoading = this._loadingCtrl.create({
      spinner: "crescent",
      content: 'جارٍ التحميل'
    })
    searchLoading.present()

    this.myObject = []

    this.myLimit += 10

    this.postsRef = this.db.database.ref("Posts")
    this.postsRef.once('value', action => {this.myListCount = Object.entries(action.val()).length})

    this.postsRef.orderByChild('postBody').limitToLast(this.myLimit).once('value', action => {
      for (let key in action.val()) {
        this.myObject.push([
          key,
          action.val()[key] as postModel
        ])
      }
    }).then(()=>{
      this.onSearch(this.searchWord)
      searchLoading.dismiss()
    })
  }

  setDataPharmacy(){
    const searchLoading = this._loadingCtrl.create({
      spinner: "crescent",
      content: 'جارٍ التحميل'
    })
    searchLoading.present()

    this.postsRef = this.db.database.ref("userData")
    this.myObject = []

    this.myLimit += 10
    this.postsRef.once('value', action => {this.myListCount = Object.entries(action.val()).length})

    this.postsRef.orderByChild('userType').equalTo('pharmacy').limitToLast(this.myLimit).once('value', action => {
      for (let key in action.val()) {
        this.myObject.push([
          key,
          action.val()[key] as UserDataModel
        ])
      }
    }).then(()=>{
      this.onSearch(this.searchWord)
      searchLoading.dismiss()
    })
  }

  onSearch(keyWord: string){
    this.searchWord = keyWord
    if (keyWord == ''){
      this.searchList = this.myObject
    }else{
      this.searchList = []
      if (this.searchType == 'post'){
        this.autoCompleteSearch(keyWord, 'postBody')
      }else{
        this.autoCompleteSearch(keyWord, 'name')
      }
    }
  }
  

  autoCompleteSearch(keyWord, searchDataName) {
    this.isResults = false
    if (keyWord && keyWord.trim() != '') {
      this.myObject.filter((item) => {
        if (item[1][searchDataName].toLowerCase().indexOf(keyWord.toLowerCase()) > -1){
          this.searchList.push(item)
          this.isResults = true
        }
      })
    }
  }







  goPreviewQues(Post){
    // open previewPost page as a modal
    let PreviewPostModal = this.modalCtrl.create(PreviewPostPage);
    PreviewPostModal.present();
    // pass post data to previewPost page
    localStorage.setItem("thePost", JSON.stringify(Post));
  }



  openProfile(profileKey){
    let loading = this._loadingCtrl.create({
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



































  // ionic refresher function
  doRefresh(refresher) {
    setTimeout(() => {
      this.navCtrl.setRoot(SearchPage)
      refresher.complete();
    }, 2000);
  }

// ionic infinity scroll function
  doInfinite(infiniteScroll) {
    if (this.searchType == 'post'){
      if (this.myLimit > this.myListCount){
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
          this.setDataPost()
          infiniteScroll.complete();
        }, 500);    
      }
    }else{
      if (this.myLimit > this.myListCount){
        setTimeout(() => {
          // this.content.scrollTo(0, this.content.scrollHeight - 63, 300);
          const toast = this._ToastController.create({
            message: 'لا توجد المزيد من الصيدليات',
            duration: 2000,
            position: 'middle'
          });
          toast.present();
          infiniteScroll.complete();
        }, 1000); 
  
      }else if (this.myLimit < this.myListCount){
        setTimeout(() => {
          this.setDataPharmacy()
          infiniteScroll.complete();
        }, 500);    
      }    }
    

  }


}