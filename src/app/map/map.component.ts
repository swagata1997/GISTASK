import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';
import { SharedService } from '../shared.service';
import { MatTableDataSource } from '@angular/material';
import { JsonPipe } from '@angular/common';


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
  filterResult: any;
  graphicArray: any[] = [];
  pointObjId: any[] = [];
  objId: any;
  filterObjId: any[] = [];
  lat: any;
  log: any;
  filterValue: any;
  filterName: any;
  filterResField: any;
  featuresPoint: any[] = [];
  newFieldValue: any[] = [];
  graphicRecordsArr: any[] = [];
  @Input() objectID: any[];
  @Input() objData: any[];
  @Input() filteredData: any[];

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
      this.queryResult();
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
  promiseRejected(error) {
    console.error('Promise rejected: ', error.message);

  }
  async queryResult() {
    const [Map, MapView, QueryTask, Query, Popup] = await loadModules(['esri/Map', 'esri/views/MapView',
    'esri/tasks/QueryTask', 'esri/tasks/support/Query',
       'esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/widgets/Popup']);
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

      this.graphicResult();

      this.headers = headers;
      this.fieldData = fieldData;
      return {headers, fieldData};
    })
      .catch(this.promiseRejected);
    const sharedServiceNew = this.sharedService;

    viewNew.on('click', (event) => {
          this.pointClick(event, viewNew, sharedServiceNew);
       });
  }
  async graphicResult() {
    const arrGraphic = [];
    const viewNew = this.view;
    const [GraphicsLayer, Graphic, webMercatorUtils, Popup, PopupTemplate] =
      await loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/geometry/support/webMercatorUtils' ,
      'esri/widgets/Popup', 'esri/PopupTemplate']);
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
      const point = webMercatorUtils.geographicToWebMercator({
        type: 'point',
        longitude: this.lat,
        latitude: this.log
      });
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
        attributes: attributesData,

      });
      this.view.popup.visible = true;
      this.view.popup.features = graphic;

     //  this.view.popup.features = arrGraphic;

      arrGraphic.push(graphic);
      }



    const layer = new GraphicsLayer({
      visible: true,
      graphics: arrGraphic,
      id: 'properties',

     });
  //  layer.popupTemplate = popupTemplate;
    this.view.map.add(layer);

    }
   async pointClick(event, viewNew, sharedServiceNew) {
    const [GraphicsLayer, Graphic, webMercatorUtils, Popup, PopupTemplate] =
    await loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/geometry/support/webMercatorUtils' ,
    'esri/widgets/Popup', 'esri/PopupTemplate']);
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
        console.log(graphiclayer.graphics);
        if (graphiclayer.graphics.length > 0) {
          console.log(graphiclayer.graphics);
          const tempFeatures = graphiclayer.graphics.items;
          const tempLength = tempFeatures.length - 1;
          for (let i = 0; i <= tempLength; i++) {
            const objectIDs = tempFeatures[i].attributes.id;
            const result = pointArr.indexOf(objectIDs);
            if (result === -1) {
              tempFeatures[i].visible = false;
            } else {
              tempFeatures[i].visible = true;
            }
          }
        }
      });
    });

  }
filterData(event: Event) {
    this.dataSource = new MatTableDataSource(this.fieldData);
    const filterValue = (document.getElementById('textValue') as HTMLInputElement).value;
    const textboxData = JSON.parse(filterValue);
    this.sharedService.filterResult.next(textboxData);
 }
pointRecords(filteredData) {
  this.pointObjId.length = 0;
  for (const filteredres of filteredData) {
    this.pointObjId.push(filteredres.OBJECTID);
  }
  const filterArray = this.pointObjId;
  const filterLayer = this.view.map.layers.find((layer) => layer.id === 'properties');
  this.view.whenLayerView(filterLayer).then((layerView) => {
    const graphiclayer = layerView.layer;
    console.log(graphiclayer.graphics);
    if (graphiclayer.graphics.length > 0) {
      console.log(graphiclayer.graphics);
      const filterFeatures = graphiclayer.graphics.items;
      const filterValueLength = filterFeatures.length - 1;
      for (let i = 0; i <= filterValueLength; i++) {
        const objectIDs = filterFeatures[i].attributes.id;
        const result = filterArray.indexOf(objectIDs);
        if (result === -1) {
          filterFeatures[i].visible = false;
        } else {
          filterFeatures[i].visible = true;
        }
      }
    }
  });
 }
closeData() {
  const str = (document.getElementById('textValue') as HTMLInputElement).value;
  const filterArray = this.pointObjId;
  // const fieldDataRes = this.fieldData;
  const propertyLayer = this.view.map.layers.find((layer) => layer.id === 'properties');
  if (str) {
    const filterFeatures = propertyLayer.graphics.items;
    const filterValueLength = filterFeatures.length - 1;
    for (let i = 0; i <= filterValueLength; i++) {
    filterFeatures[i].visible = true;
      }
    }

  this.sharedService.filterResField.next();

}
zoomIn(event) {
this.view.goTo({
      center: this.view.center,
      zoom: this.view.zoom + 1
    });
 }
zoomOut(event) {
  this.view.goTo({
    center: this.view.center,
    zoom: this.view.zoom - 1
  });
 }

ngOnInit() {

    this.initializeMap();
    this.pointObjData();

    this.sharedService.filterRecord.subscribe(filteredData => {
      this.graphicRecordsArr = filteredData ;
      this.pointRecords(filteredData);
    });
  }
ngOnDestroy() {
    if (this.view) { } {
      this.view.container = null;
    }
  }
}
