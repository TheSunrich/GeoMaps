import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component'; // Ruta al MapComponent
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [MapComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(), // Asegúrate de incluir esto
    // Otras importaciones necesarias
    ],
  exports: [MapComponent] // Exporta el MapComponent
})
export class MapModule {}