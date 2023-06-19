import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../api/database.service';
import { Coordenadas } from '../interfaces/coordenadas';
import { HttpClient } from '@angular/common/http';
import { Thingspeak } from '../interfaces/thingspeak';

@Component({
  selector: 'app-tabla-coord',
  templateUrl: './tabla-coord.component.html',
  styleUrls: ['./tabla-coord.component.css']
})
export class TablaCoordComponent {
  ListCoor: Coordenadas[] = [];
  
  constructor(private http: HttpClient) {
    this.loadCoor();
  }

  public loadCoor(): void{
    const interval = setInterval(() => {
      this.ListCoor = [];
      this.http.get<Thingspeak>('https://api.thingspeak.com/channels/2193277/feeds.json?api_key=ZFT84U02EQH0DUTH').subscribe(
        (res) => {
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
      console.log(this.ListCoor);
    }, 5000); // Intervalo de 5000 ms = 5 segundos
  }

  reload(){
    window.location.reload();
  }
}

