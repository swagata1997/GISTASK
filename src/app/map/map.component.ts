import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Query } from '@angular/core';
import { loadModules } from "esri-loader";
import { SharedService } from '../shared.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
//import { DataSource } from '@angular/cdk/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_DATA: any[] = [];
let FieldData: any[] = [];
let geometry: any[] = [];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  dataSource: MatTableDataSource<Element>;

  view: any;
  _map: any;
  layerId: string;
  _params: any;
  _qTask: any;
  ELEMENT_DATA: any[] = [];
  FieldData: any[] = [];
  geometry:any[] = [];
  MapData: any[] = [];
  pointData: any;
  FLayer: any;
  AttrData: any;
  filterName: string
  paginator: MatPaginator;
 //fieldName = 'x';
 // value = 'y';
  lat:any;
  log:any;
  @Input() objectID: any[];
  @Input() objData: any[];

  testForm: FormGroup;
  attributeName = [];
  constructor(public sharedService: SharedService) {

  }


  async initializeMap() {

    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, FeatureLayer, QueryTask, Query, Graphic, GraphicsLayer] =
        await loadModules(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/tasks/QueryTask",
          "esri/tasks/support/Query", "esri/Graphic", "esri/layers/GraphicsLayer"]);

      // Configure the Map
      const mapProperties = {
        basemap: "topo"
      };

      this._map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [-82.44384, 35.61318],
        zoom: 8,
        map: this._map
      };

      this.view = new MapView(mapViewProperties);
      const queryTask = {
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0"
      }
      this._qTask = new QueryTask(queryTask)
      const QueryFeature = {
        returnGeometry: true,
        outFields: ["*"]
      }
      this._params = new Query(QueryFeature);

      for(var i=0;i<FieldData.length;i++){
       var lat = FieldData[i].MAP_LATITUDE;
       var log = FieldData[i].MAP_LONGITUDE;
      var markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      };
      var point = {
        type: "point",
        longitude:lat,
        latitude: log
      }
     var graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol

     });
    var layer = new GraphicsLayer({
       
      });
      layer.add(graphic);
    }
      this._map.add(layer);

     
      var qTask = new QueryTask({
        url:"https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0"
      });

      var _params = new Query({
        returnGeometry: true,
        outFields: ["*"]
      });
      _params.where = '1=1';

      qTask.execute(_params).then(getResults)
        .catch(promiseRejected);

     console.log(ELEMENT_DATA);
     console.log(FieldData);

    } catch (error) {
      console.log("EsriLoader: ", error);
    }
    function getResults(response) {
      
      for (var i = 0; i < response.fields.length; i++) {
        //console.log(response.fields[i].name);
          ELEMENT_DATA.push(response.fields[i].name);
         
         
      }
      var symbol; var geometry;
      response.features.forEach(value => {
        
        FieldData.push(value.attributes);
        //console.log(FieldData.length);
       /* var lat = value.geometry.latitude;
        var log = value.geometry.longitude;
        if( value.geometry.type==="point"){
          symbol=  markerSymbol;
          geometry.push(value.geometry);
         // return geometry;
        }*/
       // this._map.graphics.add(new Graphic(value.geometry, symbol));
    })
      this.sharedService.ELEMENT_DATA.next(this.ELEMENT_DATA);
      this.sharedService.FieldData.next(this.FieldData);
      //console.log(ELEMENT_DATA);
      return { ELEMENT_DATA: ELEMENT_DATA, FieldData: FieldData,geometry };
    }
    /***********************END****************** */
    function promiseRejected(error) {
      console.error("Promise rejected: ", error.message);

    }


  }//End Map

  /*******************Get Map Record********** */
  /**************Get all first page data *****************/
  getPagingData(layer) {
    this.sharedService.objData.subscribe(elementData => {
      // console.log(elementData);
      let query = '';

      for (var i = 0; i < elementData.length; i++) {
        query += '"' + elementData[i].OBJECTID + '",'
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
  filterData() {
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
    // console.log(FieldData);

    /**********On Table click highlight Feature Layer**** */
    this.sharedService.objectID.subscribe(elementData => {
      let highlight;
      this.objectID = elementData;
      const objectID = this.objectID;
      if (this.objectID) {
        const propertyLayer = this.view.map.layers.find((layer) => { return layer.id === 'properties' });
        this.view.whenLayerView(propertyLayer).then(function (layerView) {
          //  console.log(highlight);
          if (highlight) {
            highlight.remove();
          }
          highlight = layerView.highlight(objectID);
          // console.log(highlight);
        })
      }

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

