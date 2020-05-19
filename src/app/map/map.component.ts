import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';
import { SharedService } from '../shared.service';
import { MatTableDataSource } from '@angular/material';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const headers: any[] = [];
const fieldData: any[] = [];
const graphicArray: any[] = [];
let highlight: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  dataSource: MatTableDataSource<Element>;
  view: any;
  map: any;
  layerId: string;
  params: any;
  qTask: any;
  headers: any[] = [];
  fieldData: any[] = [];
  pointObjectId: any;
  graphicArray: any[] = [];
  pointObjId: any[] = [];
  objId: any;
  lat: any;
  log: any;
  @Input() objectID: any[];
  @Input() objData: any[];
  attributeName = [];
  constructor(public sharedService: SharedService) {

  }

  async initializeMap() {

    try {
      const [Map, MapView, QueryTask, Query, Graphic, GraphicsLayer] =
        await loadModules(['esri/Map', 'esri/views/MapView', 'esri/tasks/QueryTask',
          'esri/tasks/support/Query', 'esri/Graphic', 'esri/layers/GraphicsLayer']);

      const mapProperties = {
        basemap: 'topo'
      };

      this.map = new Map(mapProperties);
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);
      const qTask = new QueryTask({
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0'
      });
      const params = new Query({
        returnGeometry: true,
        outFields: ['*']
      });
      params.where = '1=1';
      const viewNew = this.view;
      qTask.execute(params).then((response) => {
        this.getResults(response);
        /*  for ( const fieldDataValue of fieldData) {
            const objId = fieldDataValue.OBJECTID;
            const lat = fieldDataValue.MAP_LATITUDE;
            const log = fieldDataValue.MAP_LONGITUDE;
            const markerSymbol = {
             type: 'simple-marker',
             color: [226, 119, 40],
             outline: {
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
            }*/
        const graArray = this.graphicResult();
        console.log()
        const layer = new GraphicsLayer({
          visible: true,
          graphics: graArray,
          id: 'properties'
        });
        this.view.map.add(layer);
        this.headers = headers;
        this.fieldData = fieldData;

      })
        .catch(this.promiseRejected);
      const sharedServiceNew = this.sharedService;
      viewNew.on('click', (event) => {
        this.pointClick(event, viewNew, sharedServiceNew);

      });
    } catch (error) {
      console.log('EsriLoader: ', error);
    }
  }
  getResults(response: any) {
    for (const value of response.fields) {
      headers.push(value.name);
    }
    response.features.forEach(value => {

      fieldData.push(value.attributes);
    });

    return { headers, fieldData };
  }
  promiseRejected = (error) => {
    console.error('Promise rejected: ', error.message);

  }
  async graphicResult() {
    const arrGraphic = [];
    const [Graphic] = await loadModules(['esri/Graphic']);
    for (const fieldDataValue of fieldData) {
      this.objId = fieldDataValue.OBJECTID;
      this.lat = fieldDataValue.MAP_LATITUDE;
      this.log = fieldDataValue.MAP_LONGITUDE;
      const markerSymbol = {
        type: 'simple-marker',
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      };
      const point = {
        type: 'point',
        longitude: this.lat,
        latitude: this.log
      };
      const attributesData = {
        id: this.objId
      };
      let visibleStatus = true;
      if (this.pointObjId.indexOf(this.objId) === -1) {
        visibleStatus = false;
      }
      const graphic = new Graphic({
        visible: true,
        geometry: point,
        symbol: markerSymbol,
        attributes: attributesData
      });
      arrGraphic.push(graphic);
    }

    return arrGraphic;
  }
  pointClick(event, viewNew, sharedServiceNew) {
    const screenPoint = {
      x: event.x,
      y: event.y
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
  }

  pointObjData() {
    console.log('ss');
    this.sharedService.objData.subscribe(elementData => {
      this.objData = elementData;
      this.pointObjId.length = 0;
      for (const objDataValue of elementData) {
        this.pointObjId.push(objDataValue.OBJECTID);
      }
      const pointArr = this.pointObjId;
      const propertyLayer = this.view.map.layers.find((layer) => layer.id === 'properties');
      this.view.whenLayerView(propertyLayer).then((layerView) => {
        const graphiclayer = layerView.layer;
        if (graphiclayer.graphics.length > 0) {
          console.log(graphiclayer.graphics);
          const tempFeatures = graphiclayer.graphics;
          for (const tempFeaturesValue of tempFeatures) {
            tempFeaturesValue.visible = true;
            // const objectIDs = tempFeaturesValue.attributes.id;
            // const result = pointArr.indexOf(objectIDs);
            /* if (result === -1) {
               tempFeaturesValue.visible = false;
             } else {
               tempFeaturesValue.visible = true;
 
             }*/
          }
        }
      });
    });

  }
  ngOnInit() {

    this.initializeMap();
    //  this.pointObjData();

  }
  ngOnDestroy() {
    if (this.view) {
      this.view.container = null;
    }
  }
}

