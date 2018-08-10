import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/observable/timer';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
// import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';

import { authFirebaseService } from '../providers/firebase-service/firebase-service'

@Component({
 templateUrl: 'app.html' 
 
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  rootPage:any
  showSplash = true; // <-- show animation
  constructor( platform: Platform, public _Events:Events, statusBar: StatusBar, splashScreen: SplashScreen, public _authFirebaseService:authFirebaseService) {
    if (localStorage.getItem('isLogin') == 'true'){
      this.rootPage = TabsPage
    }else{
      this.rootPage = StartPage
    }


    
      
    
    platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash = false) // <-- hide animation after 3s

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