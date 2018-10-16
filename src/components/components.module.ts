import { NgModule } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar';
import { MyApp } from '../app/app.component';

@NgModule({
	declarations: [NavBarComponent, MyApp],
	imports: [],
	exports: [NavBarComponent]
})
export class ComponentsModule {}
