import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { authFirebaseService } from '../../providers/firebase-service/firebase-service';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()

@Component({

  selector: 'page-register',

  templateUrl: 'register.html',

})

export class RegisterPage {

  userAuthData ={

    email:"",

    password:""
 }
  userInfoData ={

    name: '',

    province: '',

    zone: '',

    userType: '',

    pharmacyReplyNo: '0',

    pharmacyAdress: ''

  }
  myForm: FormGroup;

  userType="user";

  constructor(public navCtrl: NavController,

    public navParams: NavParams,

    public _authFirebaseService:authFirebaseService,

    public _Events:Events,

    public fb: FormBuilder) {
  this.myForm = this.fb.group({
    password: new FormControl(null,Validators.compose([Validators.required,Validators.minLength(5)])),
    email: new FormControl(null, Validators.compose([ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]))
  })
}

  ionViewDidLoad() {

    console.log('ionViewDidLoad RegisterPage');
  }
  registerOn(){
    this.userInfoData.userType=this.userType
    this._authFirebaseService.regesterWithEmail(this.userAuthData,this.userInfoData)
    this._Events.subscribe("auth:Success", ()=>{
      this.navCtrl.setRoot(TabsPage)
    })
   }
  }
  


 

