import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database"; 
import { UserDataModel } from '../../model/DataModels';
import { ProfilePage } from "../profile/profile";
/**
 * Generated class for the HeroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hero',
  templateUrl: 'hero.html',
})
export class HeroPage {

  postsRef = this.db.database.ref("userData")
  myObject = []
  searchList = []

  isUser = Boolean(JSON.parse(localStorage["userData"])[1]['userType'] == 'user')
  myPoints = JSON.parse(localStorage["userData"])[1]['pharmacyReplyNo']
  uid = JSON.parse(localStorage["userData"])[1]['uid']

  constructor(public navCtrl: NavController, public _loadingCtrl:LoadingController, public db:AngularFireDatabase, public navParams: NavParams) {
    this.setData()
    localStorage.setItem('navTitle', 'اعلى الصيدليات تفاعلاً') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeroPage');
    if (!this.isUser){
      this.checkReplyNo()
    }
  }
  
  checkReplyNo(){
    setTimeout(() => {
      this.myPoints = JSON.parse(localStorage["userData"])[1]['pharmacyReplyNo']
      this.checkReplyNo()
    }, 2000);   
  }

  setData(){
    let loading = this._loadingCtrl.create({
      spinner: "crescent",
      content: 'جارِ التحميل'
    });
    loading.present()

    this.myObject = []
    this.postsRef.orderByChild('userType').equalTo('pharmacy').once('value', (action) => {
        for (let key in action.val()) {
          this.myObject.push([
            key,
            action.val()[key] as UserDataModel
          ])
        }
    }).then(()=>{
      this.myObject.sort((a, b) => {return b[1]['pharmacyReplyNo'] - a[1]['pharmacyReplyNo']})
      for (let i = 0 ; i < this.myObject.length ; i++){
        this.searchList.push([
          this.myObject[i][0],
          this.myObject[i][1],
          i+1
        ])
      }      
      loading.dismiss()
    })
  }
  
  openProfile(profileKey){
    let loading = this._loadingCtrl.create({
      spinner: "crescent",
      content: 'جارِ التحميل'
    });
    loading.present()
    
    this.db.object("userData/" + profileKey).snapshotChanges().subscribe(action=>{
      let profileData = action.payload.val() as UserDataModel
      let userProfile = [
        [{}],
        profileData
      ]
      localStorage.setItem("visitProfile", "true")
      this.navCtrl.push(ProfilePage, {userProfile})

      loading.dismiss() 
    });
  }



  doRefresh(refresher) {
    setTimeout(() => {
      this.navCtrl.setRoot(HeroPage)
      refresher.complete();
    }, 2000);
  }

}