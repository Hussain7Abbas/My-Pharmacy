import { EmailComposer } from '@ionic-native/email-composer';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  subject='';
  body='';
  constructor(public navCtrl: NavController, private emailComposer: EmailComposer) {
    localStorage.setItem('navTitle', 'اتصل بنا') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }
  send(){
    let email = {
      to: 'mypharmacy@codeforiraq.org',
      cc: '',
      bcc: [],
      attachments: [],
      subject: this.subject,
      body: this.body,
      isHtml: false
    };
    this.emailComposer.open(email);
  }
  goBack(){
    this.navCtrl.pop()
  }
}
