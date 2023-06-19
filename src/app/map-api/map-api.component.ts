import {  Component, OnDestroy, Renderer2, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { DatabaseService } from '../api/database.service';
import { Coordenadas } from '../interfaces/coordenadas';
import { HttpClient } from '@angular/common/http';
import { Thingspeak } from '../interfaces/thingspeak';

@Component({
  selector: 'app-map-api',
  templateUrl: './map-api.component.html',
  styleUrls: ['./map-api.component.css']
})
export class MapApiComponent implements OnDestroy {
  ListCoor: Coordenadas[] = [];
  @Input() center : L.LatLngExpression = [21.910941, -102.316465];
  mapRef: any;
  
  constructor(private renderer: Renderer2, private http: HttpClient) {
    this.loadCoor();
  }
  ngOnInit(){
  }

  ngOnDestroy(): void {
    this.mapRef.off('click');
  }


  cargaTabla(){
    const mapDiv = document.getElementById('map') as HTMLElement;
    const map = L.map(mapDiv).setView(this.center, 16); 
    this.mapRef = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    
    this.renderer.addClass(mapDiv, 'visible');

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapDiv);
    const interval = setInterval(() => {
      //Array con coordenadas    
      var latlngs :any = []; 
      
      //Código para el Leaflet Routing Machine para mostrar la línea de ruta
      const planOptions = {       
        addWaypoints: false,       
        draggableWaypoints: false     
      }; 

      const plan = new L.Routing.Plan(latlngs, planOptions);
      
      const control = L.Routing.control({
        plan,
        addWaypoints: false,
        routeWhileDragging: false
      }).addTo(map);
      
      //divide el array
      for (var i = 0; i < this.ListCoor.length; i++) {
        console.log("Entra for")
        
        var objCoorde = this.ListCoor[i];
        var lati = parseFloat(objCoorde.latitud);
        var longi = parseFloat(objCoorde.longitud);  
        var num = parseFloat(objCoorde.id);

        if(num==1){
          L.marker([longi, lati]).addTo(map).bindPopup("Punto " + num).openPopup();
        }
        latlngs.push([longi,lati]);
      }

      control.setWaypoints(latlngs); //Establece los puntos en el mapa
      control.hide();
    }, 5000); // Intervalo de 5000 ms = 5 segundos
  }

  public loadCoor(): void{
    const interval = setInterval(() => {
      this.ListCoor = [];
      this.http.get<Thingspeak>('https://api.thingspeak.com/channels/2193277/feeds.json?api_key=ZFT84U02EQH0DUTH').subscribe(
        (res) => {
          console.log(res);
          //variable para guardar la conversion de datos json a string
          const listString = res.feeds;
          //concatena los datos que se reciben uno a uno en listString en el arreglo ListCoor
          var i = 0;
          listString.forEach((element) => {
            var coord:Coordenadas = {
              id : element.entry_id.toString(),
              latitud : element.field3,
              longitud : element.field1,
              hora : element.field4
            };
            i++;
            this.ListCoor.push(coord);
          });
        },
        (e) => {
          console.log('ERROR: ' + e);
        }
      );
    }, 5000); // Intervalo de 5000 ms = 5 segundos
  }
}
