import { IonicModule, IonicRouteStrategy  } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  providers: [
    Geolocation, // Asegúrate de añadir Geolocation aquí
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
