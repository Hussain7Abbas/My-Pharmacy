import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import { HeroPage } from '../pages/hero/hero';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { StartPage } from '../pages/start/start';
import { HybridLoginPage } from '../pages/hybrid-login/hybrid-login';
import { NavBarComponent } from '../components/nav-bar/nav-bar';
import { NotifiPage } from '../pages/notifi/notifi';
import { AddPostPage } from '../pages/add-post/add-post';
import { PreviewPostPage } from '../pages/preview-post/preview-post';

import { StatusBar } from '@ionic-native/status-bar';

// ==================================== Firebase =====================================
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { postsFirebaseService, authFirebaseService, ContactUsFirebaseService } from '../providers/firebase-service/firebase-service';
import {HttpModule} from '@angular/http';
const firebaseConfig = {
  apiKey: "AIzaSyCrRhWVyR7IljNxfqOyM1olbuCKV0FF7Aw",
  authDomain: "my-pharmacy-test.firebaseapp.com",
  databaseURL: "https://my-pharmacy-test.firebaseio.com",
  projectId: "my-pharmacy-test",
  storageBucket: "my-pharmacy-test.appspot.com",
  messagingSenderId: "40681149794"
}
// ==================================== Firebase =====================================


@NgModule({
  declarations: [
    MyApp,
    NavBarComponent,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    HeroPage,
    ProfilePage,
    SearchPage,
    LoginPage,
    RegisterPage,
    StartPage,
    NotifiPage,
    AddPostPage,
    PreviewPostPage,
    HybridLoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    // ================ Firebase ==============
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
    // ================ Firebase ==============
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    HeroPage,
    ProfilePage,
    SearchPage,
    LoginPage,
    RegisterPage,
    StartPage,
    NotifiPage,
    AddPostPage,
    PreviewPostPage,
    HybridLoginPage
  ],
  providers: [
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // ================ Firebase ==============
    AngularFireAuth,
    postsFirebaseService,
    authFirebaseService,
    ContactUsFirebaseService,
    // ================ Firebase ==============
    Camera,
    SplashScreen,
    OneSignal
  ]
})
export class AppModule {}

