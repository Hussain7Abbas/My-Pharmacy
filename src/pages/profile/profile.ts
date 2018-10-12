import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController, Events} from 'ionic-angular';
import { authFirebaseService, postsFirebaseService } from "../../providers/firebase-service/firebase-service";
import { AngularFireDatabase } from "angularfire2/database"; 
import { AddPostPage } from '../add-post/add-post'
import { UserDataModel, postModel } from '../../model/DataModels';
import { PreviewPostPage } from '../preview-post/preview-post';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  userDataModel: UserDataModel={
    uid: '',
    name: '',
    province: '',
    zone: '',
    userType: '',
    pharmacyReplyNo: '0',
    pharmacyAdress: ' '
  }

  postData:postModel = {
    name: '',
    uidUser: '',
    postBody: '',
    postImg: '',
    postDate: '',
    signalId: '',
    comments: []
  }
  
  pet="deatils"

  postsRef = this.db.database.ref("Posts")
  myObject = []

  myUid = localStorage.getItem('uid')
  visitShow:boolean = true
  isUser: boolean
  userData = []

  constructor(public navCtrl: NavController, public _Events:Events, public modalCtrl: ModalController, public _postsFirebaseService:postsFirebaseService, public db:AngularFireDatabase, public _LoadingController:LoadingController, public _ToastController:ToastController, public _authFirebaseService:authFirebaseService, public alertCtrl:AlertController, public _NavParams: NavParams) {

    if (localStorage.getItem("visitProfile") == "true"){
      this.isUser = false
      this.userData = _NavParams.get("userProfile")
      localStorage.setItem("visitProfile", "false")
    }else{
        this.isUser = Boolean(JSON.parse(localStorage["userData"])[1]['userType'] == 'user')
        this.userData = JSON.parse(localStorage["userData"]);
    }
    this.visitShow = Boolean(localStorage.getItem('uid') != this.userData[1]['uid'])
    localStorage.setItem('navTitle', 'الصفحة الشخصية') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
    this.userDataModel = this.userData[1]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  editPro() {
    let prompt = this.alertCtrl.create({
      title: 'تعديل',
      // message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          value: this.userData[1]['name'],
          name: 'name',
          placeholder: 'الاسم'
        },
        {
          value: this.userData[1]['province'],
          name: 'province',
          placeholder: 'المحافظة'
        },
        {
          value: this.userData[1]['zone'],
          name: 'zone',
          placeholder: 'المنطقة'
        }
      ],
      buttons: [
        {
          text: 'اغلاق',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'حفظ',
          handler: data => {
            this.userDataModel.name=data.name,
            this.userDataModel.province=data.province,
            this.userDataModel.zone=data.zone,
            this.userData[1] = this.userDataModel,
            this._authFirebaseService.editUserProfile(this.userData[2], this.userData[1]).then(()=>{
              localStorage.setItem("userData", JSON.stringify(this.userData))
              this._Events.subscribe("details:Edit", ()=>{

              const toast = this._ToastController.create({
                message: 'تم حفظ التعديلات',
                duration: 2000
              });
              toast.present();
              this.navCtrl.setRoot(ProfilePage)
            })
            })
          }
        }
      ]
    });
    prompt.present();
  }
  
  goBack(){
    this.navCtrl.pop()
  }

  setData(){
    let loading = this._LoadingController.create({
      spinner: "crescent",
      content: 'يرجى الانتظار'
    });
    loading.present();
    this.myObject = []
    this.postsRef = this.db.database.ref("Posts")
    this.postsRef.orderByChild('uidUser').equalTo(this.myUid).once('value', action => {
      for (let key in action.val()) {
        this.myObject.push([
          key,
          action.val()[key] as postModel
        ])
      }
    }).then(()=>{
      loading.dismiss();
    })
}

  loadMyPosts(){
    this.setData()
  }

  onDelete(key){
    this._postsFirebaseService.deletePosts(key)
  }

  onEdit(thePost){
    localStorage.setItem('editPost', 'true')
    localStorage.setItem("thePost", JSON.stringify(thePost));
    // open addPost page as a modal
    let addPostModal = this.modalCtrl.create(AddPostPage);
    addPostModal.present();
    // Refresh data when the post has bening added
    this._Events.subscribe("post:Edit", ()=>{
      const toast = this._ToastController.create({
        message: 'تم حفظ التعديلات',
        duration: 2000
      });
      toast.present();
      this.navCtrl.setRoot(ProfilePage)
      localStorage.setItem('editPost', 'false')
    })
  }

  goPreviewQues(Post){
    // open previewPost page as a modal
    let PreviewPostModal = this.modalCtrl.create(PreviewPostPage);
    PreviewPostModal.present();
    // pass post data to previewPost page
    localStorage.setItem("thePost", JSON.stringify(Post));
  }
}
