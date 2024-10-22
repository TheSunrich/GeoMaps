import { IonicModule, IonicRouteStrategy  } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { MapModule } from '../components/map/map.module'; // Importar el MapModule
//import { MapComponent } from '../components/map/map.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    MapModule // Importar MapModule aquí
  ],
  declarations: [Tab1Page/*, MapComponent*/]
})
export class Tab1PageModule {}