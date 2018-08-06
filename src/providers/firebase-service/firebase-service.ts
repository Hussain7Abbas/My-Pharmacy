// import { HttpClient } from '@angular/common/http';
// import { Injectable, Type } from '@angular/core';
import { Injectable } from '@angular/core';
import { LoadingController, Events } from 'ionic-angular';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

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

  updatePosts(myList:postModel, $key) {
    return this.dataList.update($key, myList);
  }

  deletePosts($key) {
    return this.dataList.remove($key);
  }


}



// ********************************************************************************************************
// ========================================================================================================
// ========================================= Authintication Class =========================================
// ========================================================================================================
// ********************************************************************************************************


import { AngularFireAuth } from 'angularFire2/auth';
import { UserDataModel } from '../../model/DataModels';

@Injectable()
export class authFirebaseService {

  private usersList = this.db.list<UserDataModel>('userData')

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
        this.setUserInfoLocalStorage()
    })

    }
     // ============================ forget password function  ===========================

     
      forgetPasswordUser(email:any) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
        }
    // ============================ Set user data at the local storage ===========================
    setUserInfoLocalStorage(){
      let usersListObject = this.db.object('userData')

      usersListObject.snapshotChanges().subscribe(action=>{
        if (action.payload.val() == null || action.payload.val() == undefined) {
          alert('No Data')
        } else {
          this.itemArray.push(action.payload.val() as UserDataModel)
          this.myObject = Object.entries(this.itemArray[0])   

            for (const item of this.myObject) {
              if (item[1]['uid'] == localStorage.getItem('uid')) {
                localStorage.setItem("userData", JSON.stringify(item[1]));
                this._Events.publish("auth:Success")
                localStorage.setItem('isLogin','true')
              }
            }

        }
      })
    }

    // ============================ Regester Function ===========================
    regesterWithEmail(authData, userData){
        return this.afAuth.auth.createUserWithEmailAndPassword(authData.email,authData.password)
        .then(user=>{
        

        // ========================================================================
        // ========== Setting the user information in the local storage ===========
        // ========================================================================
        localStorage.setItem('isLogin','true')
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem('uid', this.afAuth.auth.currentUser.uid)
        userData.uid = localStorage.getItem('uid')
        // ========================================================================
        // ========== Setting the user information in the local storage ===========
        // ========================================================================


        
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
        }).then(()=>{
          this._Events.publish("auth:Success")
        })
        // ========================================================================
        // ====================== User Profile Details ============================
        // ========================================================================
        }).catch(error=>{
        console.error(error)
        })
    }

    logOut(){
      this.afAuth.auth.signOut()
      localStorage.setItem('isLogin','false')
    }
}