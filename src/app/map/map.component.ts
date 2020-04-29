import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Query } from '@angular/core';
import { loadModules } from 'esri-loader';
import { SharedService } from '../shared.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: any[] = [];
const FieldData: any[] = [];
const graphicArray: any[] = [];
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  dataSource: MatTableDataSource<Element>;
 view: any;
  // tslint:disable-next-line:variable-name
  _map: any;
  layerId: string;
  // tslint:disable-next-line:variable-name
  _params: any;
  // tslint:disable-next-line:variable-name
  _qTask: any;
  ELEMENT_DATA: any[] = [];
  FieldData: any[] = [];
  geometry: any[] = [];
  MapData: any[] = [];
  graphicArray: any[] = [];
  pointData: any;
  FLayer: any;
  AttrData: any;
  filterName: string;
  paginator: MatPaginator;
  lat: any;
  log: any;
  @Input() objectID: any[];
  @Input() objData: any[];

  testForm: FormGroup;
  attributeName = [];
  constructor(public sharedService: SharedService) {

  }

  async initializeMap() {

    try {
      // Load the modules for the ArcGIS API for JavaScript
      // tslint:disable-next-line:no-shadowed-variable
      const [Map, MapView, FeatureLayer, QueryTask, Query, Graphic, GraphicsLayer] =
        await loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/tasks/QueryTask',
          'esri/tasks/support/Query', 'esri/Graphic', 'esri/layers/GraphicsLayer']);

      // Configure the Map
      const mapProperties = {
        basemap: 'topo'
      };

      this._map = new Map(mapProperties);
      console.log(this._map);
      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [-82.44384, 35.61318],
        zoom: 8,
        map: this._map
      };

      this.view = new MapView(mapViewProperties);
      const queryTask = {
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0'
      };
      this._qTask = new QueryTask(queryTask);
      const QueryFeature = {
        returnGeometry: true,
        outFields: ['*']
      };
      this._params = new Query(QueryFeature);
      console.log(FieldData);
      // tslint:disable-next-line:prefer-for-of




      const qTask = new QueryTask({
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0'
      });

      // tslint:disable-next-line:variable-name
      const _params = new Query({
        returnGeometry: true,
        outFields: ['*']
      });
      _params.where = '1=1';

      qTask.execute(_params).then(getResults)
        .catch(promiseRejected);
      // tslint:disable-next-line:prefer-for-of
      setTimeout(function() {
     // tslint:disable-next-line:prefer-for-of
     for (let i = 0; i < FieldData.length; i++) {
          console.log(this._map);
          const lat = FieldData[i].MAP_LATITUDE;
          const log = FieldData[i].MAP_LONGITUDE;
          const markerSymbol = {
           type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
           color: [226, 119, 40],
           outline: {
             // autocasts as new SimpleLineSymbol()
             color: [255, 255, 255],
             width: 2
           }
         };
          const point = {
          type: 'point',
          longitude: lat,
          latitude: log
        };
          const graphic = new Graphic({
             geometry : point,
             symbol : markerSymbol
          });

          graphicArray.push(graphic);

       } }, 3000);
      const layer = new GraphicsLayer({
             graphics: [graphicArray]
           });
      this._map.add(layer);
     //  console.log(layer);

    } catch (error) {
      console.log('EsriLoader: ', error);
    }
    function getResults(response) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < response.fields.length; i++) {
        ELEMENT_DATA.push(response.fields[i].name);
         }
      response.features.forEach(value => {

        FieldData.push(value.attributes);

    });
      // this.sharedService.ELEMENT_DATA.next(this.ELEMENT_DATA);
      // this.sharedService.FieldData.next(this.FieldData);
     // console.log(ELEMENT_DATA);
      // console.log(FieldData);
      return { ELEMENT_DATA, FieldData};
      }
   /***********************END****************** */
    function promiseRejected(error) {
      console.error('Promise rejected: ', error.message);

    }


  }// End Map

  /*******************Get Map Record********** */
  /**************Get all first page data *****************/
  getPagingData(layer) {
    this.sharedService.objData.subscribe(elementData => {
      // console.log(elementData);
      let query = '';

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elementData.length; i++) {
        query += '"' + elementData[i].OBJECTID + '",';
      }

      const arrData = query.substring(0, query.length - 1);


    });
  }
  /***********************END****************** */
  /* getResults(response) {
     this.ELEMENT_DATA = [];
     for (var i = 0; i < response.fields.length; i++) {
       this.ELEMENT_DATA.push(response.fields[i].name)
       ELEMENT_DATA.push(response.fields[i].name);
     }
     this.FieldData = [];
     response.features.forEach(value => {
       this.FieldData.push(value.attributes);
       FieldData.push(value.attributes);
     })
     this.sharedService.ELEMENT_DATA.next(this.ELEMENT_DATA);
     this.sharedService.FieldData.next(this.FieldData);
     //console.log(ELEMENT_DATA);
     return { ELEMENT_DATA: ELEMENT_DATA, FieldData: FieldData };
   }
   /***********************END****************** */
  /*promiseRejected(error) {
    console.error("Promise rejected: ", error.message);

  }*/
 /* filterData() {
    const propertyLayer = this.view.map.layers.find((layer) => { return layer.id === 'properties' })

    const str = (<HTMLInputElement>document.getElementById("textValue")).value;

    if (str === '') {
      propertyLayer.definitionExpression = null;
    } else {
      propertyLayer.definitionExpression = `ADDRESS like '%` + str + `%'`;

    }
  }

  closeData() {
    const propertyLayer = this.view.map.layers.find((layer) => { return layer.id === 'properties' })
    let str = (<HTMLInputElement>document.getElementById("textValue")).value;
    if (str) {
      this.filterName = '';
      propertyLayer.definitionExpression = null;

    }
    else {
      propertyLayer.definitionExpression = `ADDRESS like '%` + str + `%'`;
    }
  }

  /*private newMethod(featureLayer: any) {

    this._map.add(featureLayer);
  };*/

  ngOnInit() {

    this.initializeMap();
    this.ELEMENT_DATA = ELEMENT_DATA;
    this.FieldData = FieldData;
    /**********On Table click highlight Feature Layer**** */
    this.sharedService.objectID.subscribe(elementData => {
      // let highlight;
      this.objectID = elementData;
      const objectID = this.objectID;
     /* if (this.objectID) {
        const propertyLayer = this.view.map.layers.find((layer) => layer.id === 'properties');
        // tslint:disable-next-line:only-arrow-functions
        this.view.whenLayerView(propertyLayer).then(function(layerView) {
          //  console.log(highlight);
          if (highlight) {
            highlight.remove();
          }
          highlight = layerView.highlight(objectID);
          // console.log(highlight);
        });
      } ;*/

    });

    /***************************END**************************** */
  }
  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}

