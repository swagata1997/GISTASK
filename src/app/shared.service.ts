import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  serviceData: any;
  ELEMENT_DATA = new Subject<Array<any>>();
  FieldData = new Subject<Array<any>>();
  constructor(private http: HttpClient) { }

  /* getData(){
    return  this.http.get('https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Landscape_Trees/FeatureServer/0')
    .subscribe((data)=>{
      this.serviceData = data.json();
      console.log(this.serviceData);
    })
   }*/


}

