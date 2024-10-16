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

  constructor(private geolocation: Geolocation) {}
  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const userLocation: [number, number] = [resp.coords.longitude, resp.coords.latitude]; // Asegúrate de que sea un arreglo de longitud 2
      console.log('User Location:', userLocation); // Verifica la ubicación del usuario
      
     // mapboxgl.accessToken = environment.mapboxToken; // Establecer el token aquí
      this.map = new mapboxgl.Map({
        container: 'map', // El ID del contenedor de HTML para el mapa
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation,
        zoom: 12,
        accessToken: environment.mapboxToken // Establecer el token aquí
      });

      // Añadir un marcador en la ubicación del usuario
      new mapboxgl.Marker()
        .setLngLat(userLocation)
        .addTo(this.map);

    }).catch((error) => {
      console.log('Error al obtener la ubicación', error);

      let errorMessage = 'Error desconocido al obtener la ubicación';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso denegado. Por favor habilita los permisos de ubicación.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible.';
          break;
        case error.TIMEOUT:
          errorMessage = 'El tiempo de espera para obtener la ubicación ha expirado.';
          break;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la ubicación',
        confirmButtonText: 'Aceptar',
        target: 'body',  // Forzamos a que el modal se muestre en el body
        customClass: {
          container: 'swal2-container'  // Aplica clase personalizada
        }
      });
    });
  }

}
