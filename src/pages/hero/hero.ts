import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database"; 
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
  counter :number
  postsRef:AngularFireList<any>
  myObject = []
  searchList = []
  isUser = Boolean(JSON.parse(localStorage["userData"])[1]['userType'] == 'user')
  myPoints = JSON.parse(localStorage["userData"])[1]['pharmacyReplyNo']
  constructor(public navCtrl: NavController, public _loadingCtrl:LoadingController, public db:AngularFireDatabase, public navParams: NavParams) {
    this.setData()
    this.counter=1;
    localStorage.setItem('navTitle', 'اعلى الصيدليات تفاعلاً') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeroPage');
  }
  
  setData(){
    let loading = this._loadingCtrl.create({
      spinner: "crescent",
      content: 'جارِ التحميل'
    });
    loading.present()

    this.postsRef = this.db.list("userData")
    this.myObject = []
    this.postsRef.query.orderByChild('userType').equalTo('pharmacy').once('value', (action) => {
        for (let key in action.val()) {
          this.myObject.push([
            key,
            action.val()[key] as UserDataModel
          ])
        }
    }).then(()=>{
      this.myObject.sort((a, b) => {return b[1]['pharmacyReplyNo'] - a[1]['pharmacyReplyNo']})
      console.log(this.myObject);
      for (let i = 0 ; i < this.myObject.length ; i++){
        this.searchList.push([
          this.myObject[i][0],
          this.myObject[i][1],
          i+1
        ])
      }
      console.log(this.searchList);
      
      loading.dismiss()
    })
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
}