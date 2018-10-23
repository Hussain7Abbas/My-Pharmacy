import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { authFirebaseService } from "../../providers/firebase-service/firebase-service";

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  userInfoData ={
    province: '',
    zone: '',
    userType: '',
    pharmacyReplyNo: '',
    pharmacyAdress: ''
}

  userData = JSON.parse(localStorage["userData"])
  myForm: FormGroup;
  isUser: Boolean = true

  constructor(public navCtrl: NavController, public navParams: NavParams, public _Events:Events, public viewCtrl: ViewController, public fb: FormBuilder, public _authFirebaseService: authFirebaseService, public _ToastController:ToastController) {
    this.userInfoData = this.userData[1]
    this.isUser = Boolean(this.userData[1]['userType'] == 'user')
    this.myForm = this.fb.group({
      name: new FormControl(null, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(20), Validators.pattern('[a-zA-Zأ-ي -]*')])),
      province: new FormControl(null,Validators.required),
      zone: new FormControl(null,Validators.required)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  saveEdit(){
    this.userData[1] = this.userInfoData
    this._authFirebaseService.editUserProfile(this.userData[2], this.userData[1])
    localStorage.setItem("userData", JSON.stringify(this.userData))
    this._ToastController.create({
      message: 'تم حفظ التعديلات',
      duration: 2000
    }).present()
    this._Events.publish('profile:Edit')
    this.viewCtrl.dismiss()
  }

  goBack(){
    this.viewCtrl.dismiss()
  }

}
