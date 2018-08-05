import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { authFirebaseService } from "../../providers/firebase-service/firebase-service";
import { UserDataModel } from '../../model/DataModels';

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

  userDataModel: UserDataModel={
    uid: '',
    name: '',
    province: '',
    zone: '',
    userType: '',
    pharmacyReplyNo: '0',
    pharmacyAdress: ' '
  }

  pet="deatils"
  isUser: boolean = Boolean(JSON.parse(localStorage["userData"])[1]['userType'] == 'user')

  userData = JSON.parse(localStorage["userData"]);
  
  constructor(public navCtrl: NavController, public _ToastController:ToastController, public _authFirebaseService:authFirebaseService, public alertCtrl:AlertController, public navParams: NavParams) {
    localStorage.setItem('navTitle', 'الصفحة الشخصية') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
    this.userDataModel = this.userData[1]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  editPro() {
    let prompt = this.alertCtrl.create({
      title: 'تعديل',
      // message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          value: this.userData[1]['name'],
          name: 'name',
          placeholder: 'الاسم'
        },
        {
          value: this.userData[1]['province'],
          name: 'province',
          placeholder: 'المحافظة'
        },
        {
          value: this.userData[1]['zone'],
          name: 'zone',
          placeholder: 'المنطقة'
        }
      ],
      buttons: [
        {
          text: 'اغلاق',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'حفظ',
          handler: data => {
            this.userDataModel.name=data.name
            this.userDataModel.province=data.province
            this.userDataModel.zone=data.zone
            this.userData[1] = this.userDataModel
            this._authFirebaseService.editUserProfile(this.userData[2], this.userData[1]).then(()=>{
              localStorage.setItem("userData", JSON.stringify(this.userData))
              const toast = this._ToastController.create({
                message: 'تم حفظ التعديلات',
                duration: 2000
              });
              toast.present();
            })
          }
        }
      ]
    });
    prompt.present();
  }
  
}
