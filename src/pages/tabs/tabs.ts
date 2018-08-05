import { Component } from '@angular/core';
import { HeroPage } from '../hero/hero';
import { ProfilePage } from '../profile/profile';
import { SearchPage } from '../search/search';
// import { AboutPage } from '../about/about';
// import { ContactPage } from '../contact/contact';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'

})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = HeroPage;
  tab3Root = SearchPage;
  tab4Root = ProfilePage;

  constructor() {

  }
}
