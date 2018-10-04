import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
// import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';
import { authFirebaseService } from "../providers/firebase-service/firebase-service";
import { OneSignal } from '@ionic-native/onesignal';
import { PreviewPostPage } from '../pages/preview-post/preview-post';

@Component({
 templateUrl: 'app.html'

})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  isLogin = Boolean(localStorage.getItem('isLogin') == 'true')
  rootPage:any
  
  constructor( platform: Platform, public _Events:Events, public modalCtrl:ModalController, public _OneSignal:OneSignal, statusBar: StatusBar, splashScreen: SplashScreen, public _authFirebaseService:authFirebaseService) {
    if (this.isLogin){
      this.rootPage = TabsPage
    }else{
      this.rootPage = StartPage
    }

  









    platform.ready().then(() => {

      this._OneSignal.startInit('e2304606-4ab1-4f9d-a0ea-1c83518b62af', '40681149794');
      this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.Notification);
      this._OneSignal.handleNotificationOpened().subscribe((res) => {
        // do something when a notification is opened
        let notifiData = res.notification.payload.additionalData
        // pass post data to previewPost page
        localStorage.setItem("thePost", JSON.stringify(notifiData['postKey'], notifiData['postData']));
        // open previewPost page as a modal
        let PreviewPostModal = this.modalCtrl.create(PreviewPostPage);
        PreviewPostModal.present();
      });
      this._OneSignal.endInit();


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
  // goProfile(){
  //   this.nav.push(ProfilePage)
  // }
  goAbout(){
    this.nav.push(AboutPage)
  }

  goInfo(){
    this.nav.push(ContactPage)
  }

  onLogOut(){
      this._authFirebaseService.logOut()
      localStorage.removeItem('userData')
      this.nav.setRoot(StartPage)
  }
}

