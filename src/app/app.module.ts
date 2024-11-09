import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
/*import { MapComponent } from './components/map/map.component';*/

import { MapModule } from './components/map/map.module'; // Importar el MapModule
import { provideHttpClient, withFetch } from '@angular/common/http';



@NgModule({
  declarations: [AppComponent/*,
    MapComponent*/],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, MapModule ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Geolocation, provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
