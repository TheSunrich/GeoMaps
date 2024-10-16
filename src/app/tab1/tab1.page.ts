import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { environment } from '../../environments/environment';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  map: mapboxgl.Map | undefined;
  marker: mapboxgl.Marker | undefined; // Declaramos la propiedad marker
  selectedOption: string = '';

  constructor(private geolocation: Geolocation) {}
  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.map = new mapboxgl.Map({
      container: 'map', // ID del contenedor en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-101.683670, 21.122115], // Posición inicial (México CDMX por ejemplo)
      zoom: 12,
      accessToken: environment.mapboxToken // Establecer el token aquí
    });
    this.map.resize();

    // Monitorear la ubicación del usuario
    const watch = this.geolocation.watchPosition();

    watch.subscribe((data) => {
      // Verificar si la respuesta es un error
      if ('coords' in data) {
        console.log(data);
        // Si es una posición válida, actualizamos el mapa
        const userLocation: [number, number] = [
          data.coords.longitude,
          data.coords.latitude
        ];

        // Verificamos si this.map está inicializado
        if (this.map) {
          // Actualiza la posición central del mapa
          this.map.setCenter(userLocation);

          // Si ya existe un marcador, actualiza su posición
          if (this.marker) {
            this.marker.setLngLat(userLocation);
          } else {
            // Si no existe un marcador, crea uno
            this.marker = new mapboxgl.Marker()
              .setLngLat(userLocation)
              .addTo(this.map);
          }
          this.map.resize();
        } else {
          console.error('El mapa no está inicializado.');
           // Mensaje
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `El mapa no está inicializado.`,
            confirmButtonText: 'Aceptar',
            target: 'body',  // Forzamos a que el modal se muestre en el body
            customClass: {
              container: 'swal2-container'  // Aplica clase personalizada
            }
          });
        }
        
      } else {
        this.map = new mapboxgl.Map({
          container: 'map', // ID del contenedor en el HTML
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-101.683670, 21.122115], // Posición inicial (México CDMX por ejemplo)
          zoom: 12,
          accessToken: environment.mapboxToken // Establecer el token aquí
        });
        this.map.resize();
        // Manejar el error
        console.error('Error al obtener la ubicación:', data);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo obtener la ubicación: ${data.message}`,
          confirmButtonText: 'Aceptar',
          target: 'body',  // Forzamos a que el modal se muestre en el body
          customClass: {
          container: 'swal2-container'  // Aplica clase personalizada
          }
        });
          
      }
    });
  }
  onOptionChange() {
    console.log('Opción seleccionada:', this.selectedOption);
    // Aquí puedes agregar lógica adicional basada en la opción seleccionada
  }

}
