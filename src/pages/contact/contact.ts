import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ContactUsFirebaseService } from '../../providers/firebase-service/firebase-service'
import { contactUs } from "../../model/DataModels";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  userData = JSON.parse(localStorage["userData"]);

  // =========== اوبجكت الرسالة ===========
  message = {
    subject:'',
    body:''
  }

  constructor(public navCtrl: NavController, public _ContactUsFirebaseService:ContactUsFirebaseService, public _AlertCtrl:AlertController) {
    localStorage.setItem('navTitle', 'اتصل بنا') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }


  send(){
    // =========== تعريف متغير التأريخ ===========
    let date = new Date
    let theDate = date.getDate() + "/" + (date.getMonth().valueOf()+1) + "/" + date.getFullYear() + "/" + date.getHours() + ":" + date.getMinutes()
    // =========== اوبجكت الرسالة للفايربيس ===========
    let theMail:contactUs = {
      message: this.message.subject + '#b#' + this.message.body,
      info: theDate + '#b#' + this.userData[1]['name'] + '#b#' + this.userData[2]
    }
    // =========== اضافة الرسالة في الفايربيس ===========
    this._ContactUsFirebaseService.addPosts(theMail).then(()=>{
      // =========== رجوع الى الصفحة السابقة ===========
      this.navCtrl.pop()
    })
    // =========== رسالة تم الارسال بنجاح ===========
    this._AlertCtrl.create({
      title: 'تم ارسال الرسالة',
      message: 'شكراً لاطلاعنا على رأيك، سوف نعمل على تنفيذه ^_^'
    }).present()
  }


  goBack(){
    this.navCtrl.pop()
  }
}
