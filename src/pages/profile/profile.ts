import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  pet="deatils"
  isUser: boolean = Boolean(JSON.parse(localStorage["userData"])['userType'] == 'user')

  userData = JSON.parse(localStorage["userData"]);
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('navTitle', 'الصفحة الشخصية') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  
}
