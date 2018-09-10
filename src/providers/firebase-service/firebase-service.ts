// import { HttpClient } from '@angular/common/http';
// import { Injectable, Type } from '@angular/core';
import { Injectable } from '@angular/core';
import { LoadingController, Events } from 'ionic-angular';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';

// ********************************************************************************************************
// ========================================================================================================
// ========================================= Posts Database Class =========================================
// ========================================================================================================
// ********************************************************************************************************

import { postModel } from '../../model/DataModels';


@Injectable()
export class postsFirebaseService {

  private dataList = this.db.list<postModel>('Posts')


  constructor(public db:AngularFireDatabase) {
    
  }

 
  addPosts(myList:postModel) {
    return this.dataList.push(myList);
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

  private dataList = this.db.list<contactUs>('/contactUs')

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
import { UserDataModel, pharmacyList, hybridLogin } from '../../model/DataModels';
import firebase from 'firebase';
import { AlertController} from 'ionic-angular';
@Injectable()
export class authFirebaseService {

  private usersList = this.db.list<UserDataModel>('userData')
  private pharmacyList = this.db.list<pharmacyList>('pharmacyList')
  private facebookList = this.db.list<hybridLogin>('facebookPharmacy')
  private googleList = this.db.list<hybridLogin>('googlePharmacy')


  postList:AngularFireObject<any>
  itemArray = []
  myObject = []
  myfilter = []
  
  constructor(public afAuth: AngularFireAuth, public _Events:Events, public db:AngularFireDatabase, public loadingCtrl: LoadingController,public alertCtrl: AlertController) {

  }


    // ============================ Login Function ===========================
    loginWithEmail(authData){
      return this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(loginUser => {
        localStorage.setItem('uid', loginUser.user.uid)
        this.setUserInfoLocalStorage(authData)
    }).then(loginUser=>{
    },error=>{
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
        subTitle: "لا يوجد حساب بهذا الايميل",
        buttons: ['موافق']
      });
      const wrong_password = this.alertCtrl.create({
        title: "تنبيه",
        subTitle: "كلمة المرور غير صحيحة",
        buttons: ['موافق']
      });
     
      if (error.code=="auth/invalid-email") {
        invalid_email.present();
      
    }
    if (error.code=="auth/user-not-found") {
      user_not_found.present();
    }
    if (error.code=="auth/network-request-failed") {
      network_error.present();
    }
    if (error.code=="auth/wrong-password") {
      wrong_password.present();
    }
  
    })

    }
     // ============================ forget password function  ===========================

     
      forgetPasswordUser(email:any) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
        }
    // ============================ Set user data at the local storage ===========================
    setUserInfoLocalStorage(authData){
      let usersListObject = this.db.object('userData')

      usersListObject.snapshotChanges().subscribe(action=>{
        if (action.payload.val() == null || action.payload.val() == undefined) {
          alert('No Data')
        } else {
          this.itemArray.push(action.payload.val() as UserDataModel)
          this.myObject = Object.entries(this.itemArray[0])   

            for (const item of this.myObject) {
              if (item[1]['uid'] == localStorage.getItem('uid')) {
                let userInfoData = [authData, item[1], item[0]]
                localStorage.setItem("userData", JSON.stringify(userInfoData))
                this._Events.publish("auth:Success")
                localStorage.setItem('isLogin','true')
              }
            }

        }
      })
    }


    // ========================== Regester Function =============================
    regesterWithEmail(authData, userData){
      return this.afAuth.auth.createUserWithEmailAndPassword(authData.email,authData.password)
      .then(user=>{
        localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
        userData.uid = localStorage.getItem('uid')
      // ========================================================================
      // ====================== User Profile Details ============================
      // ========================================================================
      this.usersList.push({
          uid: userData.uid,
          name: userData.name,
          province: userData.province,
          zone: userData.zone,
          userType: userData.userType,
          pharmacyReplyNo: userData.pharmacyReplyNo,
          pharmacyAdress: userData.pharmacyAdress
      }).then((posta)=>{
        console.log(posta);
        this.setUserInfoLocalStorage(authData)
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
      
      
  

  editUserProfile($key, myList:UserDataModel) {
    return this.usersList.update($key, myList);
  }

  logOut(){
    this.afAuth.auth.signOut()
    localStorage.setItem('isLogin','false')
  }















    registerWithFacebook(userData){
      this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {
        let facebookData = res.additionalUserInfo.profile
        localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
        userData.uid = localStorage.getItem('uid')
      // ========================================================================
      // ====================== User Profile Details ============================
      // ========================================================================
      this.usersList.push({
        uid: userData.uid,
        name: facebookData['name'],
        province: userData.province,
        zone: userData.zone,
        userType: userData.userType,
        pharmacyReplyNo: userData.pharmacyReplyNo,
        pharmacyAdress: userData.pharmacyAdress
    }).then((posta)=>{
      console.log(posta);
      this.setUserInfoLocalStorage({email: facebookData['email'], password: ''})
    })
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
      })
    }
















  loginWithFacebook(){
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then(res => {
      let facebookData = res.additionalUserInfo.profile
      this.hybridUserFind(facebookData)
      }).catch(err=>{
        console.log(err);
    })
  }



  loginWithGoogle(){
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(res => {
      let googleData = res.additionalUserInfo.profile
      this.hybridUserFind(googleData)
      }).catch(err=>{
        console.log(err);
    })
  }



  hybridUserFind(hybridData){
    let postsRef:AngularFireList<any>
    let hybridUser = []
    postsRef = this.db.list("hybridPharmacy")
    postsRef.query.orderByChild('id').equalTo(hybridData['id']).once('value', action => {
      for (let key in action.val()) {
        hybridUser.push([
          key,
          action.val()[key] as hybridLogin
        ])
      }
    }).then(()=>{
      if (hybridUser !== []){
        this.hybridDataFind(hybridUser)
      }else{
        this._Events.publish('go:Register')
      }
    })
  }




  hybridDataFind(hybridUser){
    if (hybridUser['key'] == 'inProgress'){
      alert('جارِ مراجعة طلب تسجيلك')
    }else{
      localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
    
      let userDataInfo:AngularFireList<any>
      let userData = []
      userDataInfo = this.db.list("hybridPharmacy/" + hybridUser['key'])
      userDataInfo.query.once('value', action => {
        for (let key in action.val()) {
          userData.push([
            key,
            action.val()[key] as UserDataModel
          ])
        }
      }).then(()=>{
          let userInfoData = [{email:'', password:''}, userData, userData['key']]
          localStorage.setItem("userData", JSON.stringify(userInfoData))
          this._Events.publish("auth:Success")
          localStorage.setItem('isLogin','true')
  
      })
    }
  }



  

  
  // registerGooglePharmcy(userData, googleData){
  //   localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
  //   userData.uid = localStorage.getItem('uid')
  //   // ========================================================================
  //   // ====================== User Profile Details ============================
  //   // ========================================================================
  //   this.pharmacyList.push({
  //     id : googleData['id'],
  //     userData : Object({
  //     uid: userData.uid,
  //     name: googleData['name'],
  //     province: userData.province,
  //     zone: userData.zone,
  //     userType: userData.userType,
  //     pharmacyReplyNo: userData.pharmacyReplyNo,
  //     pharmacyAdress: userData.pharmacyAdress
  //     })
  //   }).then((posta)=>{
  //   console.log(posta)
  //   })
  // }

}