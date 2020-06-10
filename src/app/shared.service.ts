import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  serviceData: any;
  headers = new Subject<Array<any>>();
  fieldData = new Subject<Array<any>>();
  objectID = new Subject<Array<any>>();
  pointObjectId = new Subject<Array<any>>();
  objData = new Subject<Array<any>>();
  pointData = new Subject<Array<any>>();
  SelectedRow = '9415';
  filterResult = new Subject<Array<any>>();
  filterRecord = new Subject<Array<any>>();
  constructor(private http: HttpClient) { }

}

