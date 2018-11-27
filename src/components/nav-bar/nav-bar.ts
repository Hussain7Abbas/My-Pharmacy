import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

// import { MyApp } from '../../app/app.component';


/**
 * Generated class for the NavBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'nav-bar',
  templateUrl: 'nav-bar.html'
})
export class NavBarComponent {

  navTitle: string = localStorage.getItem('navTitle');

  constructor(public modalCtrl: ModalController) {

  }

  // goNotifi(){
  //   let notifiModal = this.modalCtrl.create(NotifiPage);
  //   notifiModal.present();
  // }
}