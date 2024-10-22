import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
//import { MapModule } from '../components/map/map.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule/*,
    MapModule // Asegúrate de que está aquí*/
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
