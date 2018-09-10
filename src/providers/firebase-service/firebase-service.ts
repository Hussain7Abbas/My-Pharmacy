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
import { UserDataModel, pharmacyList } from '../../model/DataModels';
import firebase from 'firebase';

@Injectable()
export class authFirebaseService {

  private usersList = this.db.list<UserDataModel>('userData')
  private pharmacyList = this.db.list<pharmacyList>('pharmacyList')

  postList:AngularFireObject<any>
  itemArray = []
  myObject = []
  myfilter = []
  
  constructor(public afAuth: AngularFireAuth, public _Events:Events, public db:AngularFireDatabase, public loadingCtrl: LoadingController) {

  }


    // ============================ Login Function ===========================
    loginWithEmail(authData){
      return this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(loginUser => {
        localStorage.setItem('uid', loginUser.user.uid)
        this.setUserInfoLocalStorage(authData)
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
      console.error(error)
      })
  }

  editUserProfile($key, myList:UserDataModel) {
    return this.usersList.update($key, myList);
  }

  logOut(){
    this.afAuth.auth.signOut()
    localStorage.setItem('isLogin','false')
  }





  loginWithFacebook(){
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then(res => {
      let facebookData = res.additionalUserInfo.profile
      let uid = this.afAuth.auth.currentUser.uid
      this.userDataFind(facebookData, uid, 'facebook')
      }).catch(err=>{
        console.log(err);
    })
  }



  loginWithGoogle(){
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(res => {
      let googleData = res.additionalUserInfo.profile
      let uid = this.afAuth.auth.currentUser.uid
      this.userDataFind(googleData, uid, 'google')
      }).catch(err=>{
        console.log(err);
    })
  }



  userDataFind(hybridData, uid, loginType){
    let postsRef:AngularFireList<any>
    let userData = []
    postsRef = this.db.list("userData")
    postsRef.query.orderByChild('uid').equalTo(uid).once('value', action => {
      if (action.val() !== null){
        for (let key in action.val()) {
          console.log('userData Key:   ' + key);
          userData.push([
            key,
            action.val()[key] as UserDataModel
          ])
        }
          let userInfoData = [{email:'', password:''}, userData, userData['key']]
          localStorage.setItem("userData", JSON.stringify(userInfoData))
          this._Events.publish("auth:Success")
          localStorage.setItem('isLogin','true')
      }else{
        if (loginType == 'google'){
          this._Events.publish('go:Register_Google', hybridData)
        }else{
          this._Events.publish('go:Register_Facebook', hybridData)
        }
      }
    })
  }




  
  registerGoogle(userData, googleData){
    localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
    userData.uid = localStorage.getItem('uid')
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
    this.usersList.push({
      uid: userData.uid,
      name: googleData['name'],
      province: userData.province,
      zone: userData.zone,
      userType: userData.userType,
      pharmacyReplyNo: userData.pharmacyReplyNo,
      pharmacyAdress: userData.pharmacyAdress
    }).then((posta)=>{
      console.log('posta:   ' + posta);
      this.setUserInfoLocalStorage({email: googleData['email'], password: ''})
    })
    
    this._Events.subscribe("auth:Success", ()=>{
      if (userData.userType == 'pharmacy'){
        this.pharmacyList.push({
          uid : googleData['name'] + '#b#' + localStorage.getItem('uid')
        })
      }
    })
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
  }
  

  registerFacebook(userData, facebookData){
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
      console.log('posta:   ' + posta);
      this.setUserInfoLocalStorage({email: facebookData['email'], password: ''})
    })
    
    this._Events.subscribe("auth:Success", ()=>{
      if (userData.userType == 'pharmacy'){
        this.pharmacyList.push({
          uid : facebookData['name'] + '#b#' + localStorage.getItem('uid')
        })
      }
    })
    // ========================================================================
    // ====================== User Profile Details ============================
    // ========================================================================
  }


}