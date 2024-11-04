import { Component, AfterViewInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements AfterViewInit {;
  @Input() mapId: string | undefined;
  private map!: mapboxgl.Map;

  constructor() { }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.addDummyPins();
  }

  // Inicializar el mapa
  initializeMap() {
    (mapboxgl as any).accessToken = 'TU_MAPBOX_ACCESS_TOKEN';

    if (this.mapId) {
      this.map = new mapboxgl.Map({
        container: this.mapId,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-0.09, 51.505], // Coordenadas iniciales (Londres)
        zoom: 13
      });
    } else {
      console.error('mapId is undefined');
    }
  }

  // Agregar pines dummy
  addDummyPins() {
    const pins = [
      { lng: -0.09, lat: 51.505, info: 'Pin 1: Información del primer pin' },
      { lng: -0.1, lat: 51.51, info: 'Pin 2: Información del segundo pin' },
      { lng: -0.08, lat: 51.49, info: 'Pin 3: Información del tercer pin' }
    ];

    pins.forEach(pin => {
      const marker = new mapboxgl.Marker()
        .setLngLat([pin.lng, pin.lat])
        .addTo(this.map);

      // Evento click para mostrar la información con SweetAlert
      marker.getElement().addEventListener('click', () => {
        this.showPinInfo(pin.info);
      });
    });
  }

  // Mostrar información del pin con SweetAlert
  showPinInfo(info: string) {
    Swal.fire({
      title: 'Información del Pin',
      text: info,
      icon: 'info',
      confirmButtonText: 'Ok'
    });
  }
}
