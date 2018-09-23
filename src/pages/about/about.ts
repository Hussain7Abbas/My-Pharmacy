import { Component,ViewChild } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  currentPage = 'idea'
  teamList = []

  constructor(public navCtrl: NavController) {
    localStorage.setItem('navTitle', 'حول التطبيق') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
    this.teamList = [
      {name: 'حسين كريم', imgUrl: '../../assets/imgs/hussain.jpg', engName: 'hussain1', animate: 'fadeInDown'},
      {name: 'حسين عباس', imgUrl: '../../assets/imgs/hussainabbas.jpg', engName: 'hussain', animate: 'fadeInDown'},
      {name: 'حلا حازم', imgUrl: '../../assets/imgs/hala.jpg', engName: 'hala', animate: 'fadeInDown'},
      {name: 'الهام حسن', imgUrl: '../../assets/imgs/ilham.jpg', engName: 'ilham', animate: 'fadeInDown'},
      {name: 'سيف علي', imgUrl: '../../assets/imgs/saif.jpg', engName: 'saif', animate: 'fadeInDown'}
    ]

  }

  segment(pageName){
    let theControls = {
      idea :  document.getElementById('idea'),
      team : document.getElementById('team'),
      company : document.getElementById('company')
    }
    
    if (pageName === 'team'){
      theControls.team.style.display = 'block'; theControls.idea.style.display = 'none'; theControls.company.style.display = 'none'
      this.changeSegmentButton(pageName)
    }else if (pageName === 'idea'){
      theControls.idea.style.display = 'block'; theControls.team.style.display = 'none'; theControls.company.style.display = 'none'
      this.changeSegmentButton(pageName)
    }else if (pageName === 'company'){
      theControls.company.style.display = 'block'; theControls.team.style.display = 'none'; theControls.idea.style.display = 'none'
      this.changeSegmentButton(pageName)
    }
  }

  changeSegmentButton(pageName){
    if (pageName !== this.currentPage){
      document.getElementById(this.currentPage+'Btn').classList.remove('activeSegment')
      document.getElementById(pageName+'Btn').classList.add('activeSegment')
    }
    this.currentPage = pageName
  }

  goBack(){
    this.navCtrl.pop()
  }

}
