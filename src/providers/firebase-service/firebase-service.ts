// import { HttpClient } from '@angular/common/http';
// import { Injectable, Type } from '@angular/core';
import { Injectable } from '@angular/core';
import { LoadingController, Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { OneSignal } from "@ionic-native/onesignal";

// ********************************************************************************************************
// ========================================================================================================
// ========================================= Posts Database Class =========================================
// ========================================================================================================
// ********************************************************************************************************

import { postModel } from '../../model/DataModels';


@Injectable()
export class postsFirebaseService {

  private dataList = this.db.list('Posts')

  constructor(public db:AngularFireDatabase) {
    
  }

 
  addPosts(myList:postModel) {
    return this.dataList.push(myList) 
  }

  updatePosts($key, myList:postModel) {
    return this.dataList.update($key, myList);
  }

  deletePosts($key) {
    return this.dataList.remove($key);
  }


}



// ********************************************************************************************************
// ========================================================================================================
// ========================================= contactUs Database Class =========================================
// ========================================================================================================
// ********************************************************************************************************

import { contactUs } from '../../model/DataModels';


@Injectable()
export class ContactUsFirebaseService {

  private dataList = this.db.list('/contactUs')

  constructor(public db:AngularFireDatabase) {
    
  }

  addPosts(myList:contactUs) {
    return this.dataList.push(myList);
  }

}

// ********************************************************************************************************
// ========================================================================================================
// ========================================= Authintication Class =========================================
// ========================================================================================================
// ********************************************************************************************************


import { AngularFireAuth } from 'angularfire2/auth';
import { UserDataModel } from '../../model/DataModels';
import firebase from 'firebase';
import { AlertController} from 'ionic-angular';

@Injectable()
export class authFirebaseService {

  private usersList = this.db.database.ref('userData')
  private pharmacyList = this.db.database.ref('pharmacyList')

  constructor(public afAuth: AngularFireAuth, public _Events:Events, public _OneSignal:OneSignal, public db:AngularFireDatabase, public loadingCtrl: LoadingController,public alertCtrl: AlertController) {

  }


    // ============================ Login Function ===========================
    loginWithEmail(authData){
      let loginLoader = this.loadingCtrl.create({
        content: "جارٍ التسجيل ...",
        spinner: "crescent",
      })
      loginLoader.present()
      return this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(loginUser => {
        const emailVerified = loginUser.user.emailVerified.valueOf();
        console.log(emailVerified);
        
        if (emailVerified){
        localStorage.setItem('uid', loginUser.user.uid)
        this.setScanLocalStorageByUid(authData, localStorage.getItem('uid'))
        loginLoader.dismiss()
        }else {
          loginLoader.dismiss()
          this.alertCtrl.create({
            title: "حسابك غير مؤكد",
            subTitle: "يرجى تأكيد حسابك عن طريق الرابط المرسل الى الايميل الخاص بك",
            buttons: ['حسنا']
          }).present();
          loginUser.user.sendEmailVerification()
          this.afAuth.auth.signOut();
        }
    
    }).then(()=>{}, error=>{
      const invalid_email = this.alertCtrl.create({
        title: "تنبيه",
        subTitle: "الايميل غير صالح ",
        buttons: ['موافق']
      });
      const network_error = this.alertCtrl.create({
        title: "تنبيه",
        subTitle: "خطأ في اتصال الانترنيت",
        buttons: ['موافق']
      });
      const user_not_found = this.alertCtrl.create({
        title: "تنبيه",
        subTitle: "لا يوجد حساب بهذا الايميل",
        buttons: ['موافق']
      });
      const wrong_password = this.alertCtrl.create({
        title: "تنبيه",
        subTitle: "كلمة المرور غير صحيحة",
        buttons: ['موافق']
      });
     
    if (error.code=="auth/invalid-email") {
      loginLoader.dismiss()
      invalid_email.present()
    }
    if (error.code=="auth/user-not-found") {
      loginLoader.dismiss()
      user_not_found.present()
    }
    if (error.code=="auth/network-request-failed") {
      loginLoader.dismiss()
      network_error.present()
    }
    if (error.code=="auth/wrong-password") {
      loginLoader.dismiss()
      wrong_password.present()
    }
  
    })
  
    }
   


    checkVerified(authData){
      return this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(loginUser => {
        console.log(loginUser.user.emailVerified.valueOf());
        setTimeout(()=>{
          if (loginUser.user.emailVerified.valueOf()){
            localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
            this.setScanLocalStorageByUid(authData, localStorage.getItem('uid'))
          }else{
            this.afAuth.auth.signOut()
            this.checkVerified(authData)
          }
        }, 1000);
      })
    }
     // ============================ forget password function  ===========================

     
      forgetPasswordUser(email:any) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
        }
    // ============================ Set user data at the local storage ===========================
    setUserInfoLocalStorage(authData, userData, posta){
      let userInfoData = [authData, userData, (String(posta).split('/'))[4]]
      localStorage.setItem("userData", JSON.stringify(userInfoData))
      this._Events.publish("auth:Success")
      localStorage.setItem('isLogin','true')
      this._OneSignal.setSubscription(true)

      if (userData[0][1]['userType'] == 'pharmacy'){
        this._OneSignal.sendTag('userType', 'pharmacy')
      }else if (userData[0][1]['userType'] == 'user'){
        this._OneSignal.sendTag('userType', 'user')
      }
      
    }

    setScanLocalStorageByUid(authData, uid){

      this.usersList.orderByChild('uid').equalTo(uid).once('value', action => {
        let userData = []
        for (let key in action.val()) {
          userData.push([
            key,
            action.val()[key] as UserDataModel
          ])
        }
        let userInfoData = [authData, userData[0][1], userData[0][0]]
        localStorage.setItem("userData", JSON.stringify(userInfoData))
        this._Events.publish("auth:Success")
        localStorage.setItem('isLogin','true')
        this._OneSignal.setSubscription(true)

        if (userData[0][1]['userType'] == 'pharmacy'){
          this._OneSignal.sendTag('userType', 'pharmacy')
        }else if (userData[0][1]['userType'] == 'user'){
          this._OneSignal.sendTag('userType', 'user')
        }

      })

    }

    // ========================== Register Function =============================
    regesterWithEmail(authData, userData){
      return this.afAuth.auth.createUserWithEmailAndPassword(authData.email,authData.password)
      .then(user=>{
        localStorage.setItem('uid', user.user.uid)
      // ========================================================================
      // ====================== User Profile Details ============================
      // ========================================================================
      this.usersList.push({
          uid: user.user.uid,
          name: userData.name,
          province: userData.province,
          zone: userData.zone,
          userType: userData.userType,
          pharmacyReplyNo: userData.pharmacyReplyNo,
          pharmacyAdress: userData.pharmacyAdress,
      }).then(()=>{

      })
      // ========================================================================
      // ====================== User Profile Details ============================
      // ========================================================================
      }).catch(error=>{
        const email_already_in_use = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "الايميل مسجل به مسبقا",
          buttons: ['موافق']
        });
          
        
        const weak_password = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "كلمة المرور ضعيفة",
          buttons: ['موافق']
        });
        const invalid_email = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "الايميل غير صالح ",
          buttons: ['موافق']
        });
        const network_error = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "خطأ في الاتصال في الانترنيت",
          buttons: ['موافق']
        });
        const user_not_found = this.alertCtrl.create({
          title: "تنبيه",
          subTitle: "لا يوجد حساب",
          buttons: ['موافق']
        });
        if (error.code=="auth/email-already-in-use") {
          email_already_in_use.present();
        }
        if (error.code=="auth/weak-password") {
          weak_password.present();
        }
        if (error.code=="auth/invalid-email") {
          invalid_email.present();
        
      }
      if (error.code=="auth/user-not-found") {
        user_not_found.present();
      }
      if (error.code=="auth/network-request-failed") {
        network_error.present();
      }
    
        })
    }
      
     
  

  editUserProfile($key, myList) {
    return this.usersList.update($key, myList);
  }

  logOut(){
    this.afAuth.auth.signOut()
    localStorage.setItem('isLogin','false')
  }





  loginWithFacebook(){
    this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())
    .then(()=> {
      firebase.auth().getRedirectResult().then(res=>{
        let facebookData = res.additionalUserInfo.profile
        let uid = this.afAuth.auth.currentUser.uid
        this.userDataFind(facebookData, uid, 'facebook')
      })
      }).catch(err=>{
        console.log(err);
    })
  }



  loginWithGoogle(){
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    .then(()=> {
      firebase.auth().getRedirectResult().then(res=>{
        let googleData = res.additionalUserInfo.profile
        let uid = this.afAuth.auth.currentUser.uid
        this.userDataFind(googleData, uid, 'google')
      })
    }).catch(err=>{
      console.log(err);
    })
  }



  userDataFind(hybridData, uid, loginType){
    this.usersList.orderByChild('uid').equalTo(uid).once('value', action => {
      let userData = []
      if (action.val() !== null){
        for (let key in action.val()) {
          console.log('userData Key:   ' + key);
          userData.push([
            key,
            action.val()[key] as UserDataModel
          ])
        }
          let userInfoData = [{email:'', password:''}, userData[0][1], userData[0][0]]
          localStorage.setItem("userData", JSON.stringify(userInfoData))
          this._Events.publish("auth:Success")
          localStorage.setItem('isLogin','true')
      }else{
        if (loginType == 'google'){
          this._Events.publish('go:Register_Google', hybridData)
        }else if (loginType == 'google'){
          this._Events.publish('go:Register_Facebook', hybridData)
        }
      }
    })
  }




  
  registerGoogle(userData, googleData){
    localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
    userData.uid = localStorage.getItem('uid')
    userData.signalId = localStorage.getItem('signalId')
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
    let userInfoData:UserDataModel = {
      uid: userData.uid,
      name: googleData['name'],
      province: userData.province,
      zone: userData.zone,
      userType: userData.userType,
      pharmacyReplyNo: userData.pharmacyReplyNo,
      pharmacyAdress: userData.pharmacyAdress,
    }

    this.usersList.push(userInfoData).then((posta)=>{
      this.setUserInfoLocalStorage({email: googleData['email'], password: ''}, userInfoData, posta)
    })
    
    this._Events.subscribe("auth:Success", ()=>{
      if (userData.userType == 'pharmacy'){
        this.pushPharmacyList(googleData['name'], '')
      }
    })
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
  }
  

  registerFacebook(userData, facebookData){
    localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
    userData.uid = localStorage.getItem('uid')
    userData.signalId = localStorage.getItem('signalId')
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
    let userInfoData:UserDataModel = {
      uid: userData.uid,
      name: facebookData['name'],
      province: userData.province,
      zone: userData.zone,
      userType: userData.userType,
      pharmacyReplyNo: userData.pharmacyReplyNo,
      pharmacyAdress: userData.pharmacyAdress,
    }
    
    this.usersList.push(userInfoData).then((posta)=>{
      this.setUserInfoLocalStorage({email: facebookData['email'], password: ''}, userInfoData, posta)
    })
    
    this._Events.subscribe("auth:Success", ()=>{
      if (userData.userType == 'pharmacy'){
        this.pushPharmacyList(facebookData['name'], '')
      }
    })
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
  }

  pushPharmacyList(userName, imgUrl){
    this.pharmacyList.push({
      uid : userName + '#b#' + localStorage.getItem('uid'),
      img: imgUrl
    })
  }
  
}