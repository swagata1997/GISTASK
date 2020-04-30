import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Query } from '@angular/core';
import { loadModules } from 'esri-loader';
import { SharedService } from '../shared.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: any[] = [];
const FieldData: any[] = [];
const graphicArray: any[] = [];
const res: any[] = [];
// const pointObjectId: any;
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
  pointObjectId: any;
  geometry: any[] = [];
  MapData: any[] = [];
  graphicArray: any[] = [];
  pointObjId: any[] = [];
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
     // console.log(this._map);
      // Initialize the MapView
      const mapViewProperties = {
      container: this.mapViewEl.nativeElement,
      //    center: [-82.44384, 35.61318],
      // zoom: 4,
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
     // const res: any;
      qTask.execute(_params).then(this.getResults)
        .catch(this.promiseRejected);
      // tslint:disable-next-line:prefer-for-of
      const viewNew = this.view;
      const sharedServiceNew = this.sharedService;
      // tslint:disable-next-line:only-arrow-functions
      setTimeout(() => {
       // console.log(this.view);
     // tslint:disable-next-line:prefer-for-of
       const lenObjId = this.pointObjId.length;
        // tslint:disable-next-line:prefer-for-of
        for ( let i = 0; i < FieldData.length; i++ ) {
          const objId = FieldData[i].OBJECTID;
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
          const attributesData = {
              id :  objId
        };
          let visibleStatus = true;
          if ( this.pointObjId.indexOf(objId) === -1) {
              visibleStatus = false;       }
          const graphic = new Graphic({
            visible: visibleStatus,
             geometry : point,
             symbol : markerSymbol,
             attributes : attributesData

          });
          graphicArray.push(graphic);
          // tslint:disable-next-line:align
       }

       const layer = new GraphicsLayer({
         visible: true,
        graphics: graphicArray,
         id : 'properties'
      });
       viewNew.map.add(layer);
       // tslint:disable-next-line:prefer-const
       let highlight: any;
       viewNew.on('click', (event) => {
        const screenPoint = {
          x : event.x,
          y : event.y
        };
        viewNew.hitTest(screenPoint).then((response) => {
           if (response) {
             const graphicLayer = response.results[0].graphic.layer;
             const obId = response.results[0].graphic.attributes.id;
             viewNew.whenLayerView(graphicLayer).then((layerView) => {
              if (highlight) {
                highlight.remove();
              }
              highlight = layerView.highlight(response.results[0].graphic);
            });
             sharedServiceNew.pointObjectId.next(obId);
           }
           });
         });
    }, 2500);
   } catch (error) {
      console.log('EsriLoader: ', error);
    }
   }// End Map
 getResults = (response: any) => {
    // tslint:disable-next-line:prefer-for-of
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < response.fields.length; i++) {
      ELEMENT_DATA.push(response.fields[i].name);
       }
    response.features.forEach(value => {

      FieldData.push(value.attributes);
      });

    return { ELEMENT_DATA, FieldData};
    }
     promiseRejected = (error) => {
      console.error('Promise rejected: ', error.message);

    }


   ngOnInit() {

    this.initializeMap();
    this.ELEMENT_DATA = ELEMENT_DATA;
    this.FieldData = FieldData;
    this.sharedService.objData.subscribe(elementData => {
      this.objData = elementData;
      this.pointObjId.length = 0;         // Get Page Data
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.objData.length; i++) {
         this.pointObjId.push(this.objData[i].OBJECTID);
      }
      const pointArr = this.pointObjId;
      const propertyLayer = this.view.map.layers.find((layer) => layer.id === 'properties');
      // tslint:disable-next-line: only-arrow-functions
      this.view.whenLayerView(propertyLayer).then(function(layerView) {
        const graphiclayer = layerView.layer;
        if (graphiclayer.graphics.length > 0) {
          const tempFeatures = graphiclayer.graphics.items;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < tempFeatures.length; i++) {
            const objectIDs = tempFeatures[i].attributes.id;
            const result  = pointArr.indexOf(objectIDs);
            if ( result === -1) {
            tempFeatures[i].visible = false;
            } else {
              tempFeatures[i].visible = true;

            }
          }
        }
      });
     }, error => {
       console.log(error);
     });
    }
  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}

