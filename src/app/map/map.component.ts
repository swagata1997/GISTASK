import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Query } from '@angular/core';
import { loadModules } from "esri-loader";
import { SharedService } from '../shared.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_DATA: any[] = [];
let FieldData: any[] = [];
let featureLayerView: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  view: any;
  _map: any;
  _params: any;
  _qTask: any;
  ELEMENT_DATA: any[] = [];
  FieldData: any[] = [];
  AttrData: any;

  attributeName = [];
  constructor(public sharedService: SharedService) {

  }

  async initializeMap() {
    let jsonArrayObject = [];
    let attributeName = [];
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, FeatureLayer] =
        await loadModules(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/tasks/QueryTask",
          "esri/tasks/support/Query"]);

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


      const featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0",
        outFields: ['*'],
        id: 'properties'
      });
      this.newMethod(featureLayer);
      this.view.whenLayerView(featureLayer).then(layerView => {
        console.log(layerView);
        layerView.watch("updating", val => {
          if (!val) {  // wait for the layer view to finish updating
            layerView.queryFeatures({
              outFields: layerView.availableFields
            }).then(results => {
              console.log(results)
              this.getResults(results);
            });
          }
        });
      });
      /**************************Highlight************************************ */
      this.view.when().then(function () {
        this.view.whenLayerView(featureLayer).then(function (layerView) {
          let Highlight;
          this.view.on("click", function (event) {
            this.hitTest(event).then(function (event) {
              let results = event.results.filter(function (result) {
                return result.graphic.layer.FieldData;
              });
              let result = results[0];
              Highlight && Highlight.remove();
              if (result) {
                featureLayer.graphic = result.graphic;
                Highlight = layerView.highlight(result.graphic);
              } else {

              }
            })
          })
        })
      })
      /***************************End Highlight******************************************/
    } catch (error) {
      console.log("EsriLoader: ", error);
    }

  }//End Map

  getResults(response) {
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

    return { ELEMENT_DATA: ELEMENT_DATA, FieldData: FieldData };
  }
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
    /* const propertyLayer = this.view.map.layers.find((layer) => { return layer.id === 'properties' })
     const str = (<HTMLInputElement>document.getElementById("textValue")).value;
     if (str === '') {
       propertyLayer.definitionExpression = null;
     }*/
  }


  private newMethod(featureLayer: any) {
    this._map.add(featureLayer);
  }

  ngOnInit() {

    this.initializeMap();
    this.ELEMENT_DATA = ELEMENT_DATA;
    console.log(this.ELEMENT_DATA);
    this.FieldData = FieldData;

  }
  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}

