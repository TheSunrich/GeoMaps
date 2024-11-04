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
          this.addPins(userLocation, radius);
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

  addPins(center: [number, number], radius: number) {
    if (!this.map) {
      console.error('El mapa no está inicializado.');
      return;
    }
  
    const pins = this.generateRandomPins(center, radius, 3); // Generar 3 pines aleatorios dentro del círculo
    console.log('Coordenadas de los pines:', pins); // Mensaje de depuración
    pins.forEach(pin => {
      console.log('Agregando pin en:', pin.coordinates); // Mensaje de depuración
      const marker = new mapboxgl.Marker({ color: 'red' }) // Asegúrate de que el pin sea visible
        .setLngLat(pin.coordinates)
        .addTo(this.map!); // El operador '!' asegura que this.map no es undefined
  
      // Evento click en el pin
      marker.getElement().addEventListener('click', () => {
        this.showPinInfo(pin.info); // Pasar el objeto info a la función
      });
    });
  }

  generateRandomPins(center: [number, number], radius: number, numPins: number): { coordinates: [number, number], info: PinInfo }[] {
    const pins: { coordinates: [number, number], info: PinInfo }[] = [];
    const minDistance = 0.1 * radius; // Límite inferior del 10% del radio
  
    for (let i = 0; i < numPins; i++) {
      const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio en radianes
      const distance = minDistance + Math.random() * (radius - minDistance); // Distancia aleatoria dentro del radio
  
      // Calcular las nuevas coordenadas en base a la distancia en metros
      const deltaLat = distance * Math.cos(angle) / 111320; // 1 grado de latitud = 111.32 km
      const deltaLng = distance * Math.sin(angle) / (111320 * Math.cos(center[1] * (Math.PI / 180))); // 1 grado de longitud varía con la latitud
  
      const lat = center[1] + deltaLat;
      const lng = center[0] + deltaLng;
  
      // Asegurarse de que las coordenadas estén dentro del rango válido
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        pins.push({
          coordinates: [lng, lat],
          info: this.generateRandomPinInfo() // Generar información aleatoria para el pin
        });
      } else {
        console.error(`Coordenadas inválidas calculadas: [${lng}, ${lat}]`);
      }
    }
  
    return pins;
  }

generateRandomPinInfo(): PinInfo {
  const names = ['Restaurante La Esquina', 'Café Central', 'Hotel Las Palmas', 'Tienda de regalos', 'Farmacia San Pablo'];
  const addresses = ['Calle Falsa 123', 'Avenida Siempre Viva 456', 'Boulevard Principal 789', 'Plaza de la Libertad', 'Calle de la Salud 012'];
  const openingHours = ['8:00 AM', '7:00 AM', '24 horas'];
  const closingHours = ['10:00 PM', '8:00 PM', 'N/A'];
  const phones = ['(123) 456-7890', '(987) 654-3210', '(555) 123-4567',   '(777) 888-9999', '(000) 111-2222'];

  const index = Math.floor(Math.random() * names.length);

  return {
    name: names[index],
    address: addresses[index],
    openingHours: openingHours[index],
    closingHours: closingHours[index],
    phone: phones[index]
  };
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
  if (this.map && this.marker) {
    const userLocation: [number, number] = [
      this.marker.getLngLat().lng,
      this.marker.getLngLat().lat
    ];
    const radius = Number(this.selectedOption) || 1000;
    this.drawCircle(userLocation, radius);
    this.addPins(userLocation, radius);
    // Aquí puedes agregar lógica adicional basada en la opción seleccionada
  }
}
}