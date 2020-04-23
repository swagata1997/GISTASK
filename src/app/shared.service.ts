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
  objectID = new Subject<Array<any>>();
  objData = new Subject<Array<any>>();
  pointData = new Subject<Array<any>>();
  SelectedRow = '9415';
  constructor(private http: HttpClient) { }

}

