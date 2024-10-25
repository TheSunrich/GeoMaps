import { Component, OnInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

interface PinInfo {
  name: string;
  address: string;
  openingHours: string;
  closingHours: string;
  phone: string;
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})


export class MapComponent implements OnInit {
  @Input() mapId: string = ''; // Recibe un ID único para el contenedor del mapa
  map: mapboxgl.Map | undefined;
  marker: mapboxgl.Marker | undefined; // Declaramos la propiedad marker
  selectedOption: string = '1000';
  

  constructor(private geolocation: Geolocation) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    // Inicializar el mapa solo si no está inicializado
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-101.683670, 21.122115],
        zoom: 13,
        accessToken: environment.mapboxToken,
      });
      this.map.resize();
    }

    // Monitorear la ubicación del usuario
    const watch = this.geolocation.watchPosition();

    watch.subscribe((data) => {
      if ('coords' in data) {
        const userLocation: [number, number] = [
          data.coords.longitude,
          data.coords.latitude,
        ];

        if (this.map) {
          // Actualiza la posición central del mapa
          this.map.setCenter(userLocation);

          // Actualiza el marcador del usuario
          if (this.marker) {
            this.marker.setLngLat(userLocation);
          } else {
            this.marker = new mapboxgl.Marker()
              .setLngLat(userLocation)
              .addTo(this.map);
          }

          this.map.resize();

          // Dibuja el círculo de proximidad según la opción seleccionada
          const radius = Number(this.selectedOption) || 1000;
          this.drawCircle(userLocation, radius);

          // Llamar la función para agregar pines al mapa
          this.addPins();
        }
      } else {
        console.error('Error al obtener la ubicación:', data);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo obtener la ubicación: ${data.message}`,
        });
      }
    });
  }

  addPins() {
    // Datos de los pines con múltiples propiedades
    const pins = [
      {
        lng: -101.686,
        lat: 21.125,
        info: {
          name: 'Restaurante La Esquina',
          address: 'Calle Falsa 123',
          openingHours: '8:00 AM',
          closingHours: '10:00 PM',
          phone: '(123) 456-7890'
        }
      },
      {
        lng: -101.680,
        lat: 21.130,
        info: {
          name: 'Café Central',
          address: 'Avenida Siempre Viva 456',
          openingHours: '7:00 AM',
          closingHours: '8:00 PM',
          phone: '(987) 654-3210'
        }
      },
      {
        lng: -101.690,
        lat: 21.120,
        info: {
          name: 'Hotel Las Palmas',
          address: 'Boulevard Principal 789',
          openingHours: '24 horas',
          closingHours: 'N/A',
          phone: '(555) 123-4567'
        }
      }
    ];
  
    pins.forEach((pin) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([pin.lng, pin.lat])
        .addTo(this.map!); // Agregar el marcador al mapa
  
      // Evento click en el pin
      marker.getElement().addEventListener('click', () => {
        this.showPinInfo(pin.info); // Pasar el objeto info a la función
      });
    });
  }
  

  // Método para mostrar SweetAlert con la información del pin
  showPinInfo(info: PinInfo) {
    if (this.map) {
      this.map.getCanvas().style.pointerEvents = 'none'; // Desactiva la interacción con el mapa
    }
  
    // Utilizamos HTML para formatear el contenido del SweetAlert
    Swal.fire({
      title: info.name,
      html: `
        <p><strong>Dirección:</strong> ${info.address}</p>
        <p><strong>Horario de apertura:</strong> ${info.openingHours}</p>
        <p><strong>Horario de cierre:</strong> ${info.closingHours}</p>
        <p><strong>Teléfono:</strong> ${info.phone}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Ok',
    }).then(() => {
      if (this.map) {
        this.map.getCanvas().style.pointerEvents = 'auto'; // Reactiva la interacción con el mapa
      }
    });
  }

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
      const lng =
        center[0] + (radius / 6378137) * (180 / Math.PI) * Math.cos(angle);
      const lat =
        center[1] + (radius / 6378137) * (180 / Math.PI) * Math.sin(angle);
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
