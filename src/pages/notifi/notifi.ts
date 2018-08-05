import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NotifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifi',
  templateUrl: 'notifi.html',
})
export class NotifiPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifiPage');
  }

  goBack(){
    this.viewCtrl.dismiss();
   }
}
