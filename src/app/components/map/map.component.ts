import { Component, OnInit,  Input  } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { environment } from '../../../environments/environment';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit {
  @Input() mapId: string = ''; // Recibe un ID único para el contenedor del mapa
  map: mapboxgl.Map | undefined;
  marker: mapboxgl.Marker | undefined; // Declaramos la propiedad marker
  selectedOption: string = '1000';

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    // Inicializar el mapa solo si no está inicializado
    if (!this.map) {
      console.log(this.mapId)
      this.map = new mapboxgl.Map({
        container: 'map',
       // container: this.mapId, // Usa el ID único
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-101.683670, 21.122115],
        zoom: 13,
        accessToken: environment.mapboxToken
      });
      this.map.resize();
    }
  
    // Monitorear la ubicación del usuario
    const watch = this.geolocation.watchPosition();
  
    watch.subscribe((data) => {
      if ('coords' in data) {
        console.log(data.coords.longitude);
        console.log(data.coords.latitude);
        const userLocation: [number, number] = [
          data.coords.longitude,
          data.coords.latitude
        ];
  
        if (this.map) {
          // Actualiza la posición central del mapa
          this.map.setCenter(userLocation);
  
          // Actualiza el marcador
          if (this.marker) {
            this.marker.setLngLat(userLocation);
          } else {
            this.marker = new mapboxgl.Marker()
              .setLngLat(userLocation)
              .addTo(this.map);
          }
  
          this.map.resize();
          // Dibuja el círculo de proximidad
         // this.drawCircle(userLocation, 1000);
          this.map.on('style.load', () => {
          // Aquí puedes agregar tus fuentes y capas
         // this.drawCircle(userLocation, 1000); // Llama a tu método para dibujar el círculo

           // Dibuja el círculo por defecto con el radio de la opción seleccionada
          const radius = Number(this.selectedOption) || 1000; // Valor por defecto de 1000 si no se selecciona
          this.drawCircle(userLocation, radius); // Actualiza con el nuevo radio
          
        });
        }
      } else {
        if (!this.map) {
          this.map = new mapboxgl.Map({
            //container: 'map',
            // container: 'map',
            container: this.mapId, // Usa el ID único
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-101.683670, 21.122115],
            zoom: 13,
            accessToken: environment.mapboxToken
          });
          this.map.resize();
        }
        console.error('Error al obtener la ubicación:', data);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo obtener la ubicación: ${data.message}`,
        });
        
        
      }
    });
  }
  // fin de loadMap
  
   // Método para dibujar el círculo
  drawCircle(center: [number, number], radius: number) {
    const circle = this.createCircle(center, radius);
  
    if (this.map) {
      // Verificar si la capa ya existe y eliminarla si es necesario
      if (this.map.getLayer('circle-layer')) {
        this.map.removeLayer('circle-layer');
      }
  
      // Verificar si la fuente ya existe y eliminarla si es necesario
      if (this.map.getSource('circle')) {
        this.map.removeSource('circle');
      }
  
      // Añadir el círculo como fuente GeoJSON
      this.map.addSource('circle', {
        type: 'geojson',
        data: circle,
      });
  
      // Añadir el círculo al mapa
      this.map.addLayer({
        id: 'circle-layer',
        type: 'fill',
        source: 'circle',
        layout: {},
        paint: {
          'fill-color': '#888',
          'fill-opacity': 0.5,
        },
      });
    }
  }

  
  // Método para crear un círculo en formato GeoJSON
  createCircle(center: [number, number], radius: number) {
    const numPoints = 64; // Número de puntos que formarán el círculo
    const coords: [number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const lng = center[0] + (radius / 6378137) * (180 / Math.PI) * Math.cos(angle);
      const lat = center[1] + (radius / 6378137) * (180 / Math.PI) * Math.sin(angle);
      coords.push([lng, lat]);
    }

    // Cierra el círculo volviendo al primer punto
    coords.push(coords[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords], // Debe ser un array de arrays para un polígono
      },
      properties: {}, // Propiedades vacías
    } as GeoJSON.Feature<GeoJSON.Geometry>; // Asegurando que el tipo es correcto
  }
  

  onOptionChange() {
    console.log('Opción seleccionada:', this.selectedOption);
    // Aquí puedes agregar lógica adicional basada en la opción seleccionada
    
  }

}
