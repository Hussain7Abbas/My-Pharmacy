import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
// import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';
import { authFirebaseService } from "../providers/firebase-service/firebase-service";
import { OneSignal } from '@ionic-native/onesignal';

@Component({
 templateUrl: 'app.html'

})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  isLogin = Boolean(localStorage.getItem('isLogin') == 'true')
  rootPage:any
  
  constructor( platform: Platform, public _Events:Events, public _OneSignal:OneSignal, statusBar: StatusBar, splashScreen: SplashScreen, public _authFirebaseService:authFirebaseService) {
    if (this.isLogin){
      this.rootPage = TabsPage
    }else{
      this.rootPage = StartPage
    }

  
    this._OneSignal.startInit('e2304606-4ab1-4f9d-a0ea-1c83518b62af', '40681149794');

    this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.InAppAlert);

    this._OneSignal.handleNotificationReceived().subscribe((data) => {
      
    alert('notification is received');
    alert( JSON.stringify(data.payload.title+data.payload.body)  );

    });



    this._OneSignal.handleNotificationOpened().subscribe((res) => {
      // do something when a notification is opened
      alert('notification is opened');

    });
    this._OneSignal.endInit();








    platform.ready().then(() => {

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

