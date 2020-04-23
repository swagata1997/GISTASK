import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Query } from '@angular/core';
import { loadModules } from "esri-loader";
import { SharedService } from '../shared.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_DATA: any[] = [];
let FieldData: any[] = [];
let pointFilter: any[] = [];

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
  _params: any;
  _qTask: any;
  ELEMENT_DATA: any[] = [];
  FieldData: any[] = [];
  MapData: any[] = [];
  pointData: any;
  FLayer: any;
  AttrData: any;
  filterName: string
  paginator: MatPaginator;
  fieldName = 'x';
  value = 'y';
  @Input() objectID: any[];
  @Input() objData: any[];

  testForm: FormGroup;
  attributeName = [];
  constructor(public sharedService: SharedService) {

  }


  async initializeMap() {

    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, FeatureLayer, Field, lang] =
        await loadModules(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/tasks/QueryTask",
          "esri/tasks/support/Query", "dojo/_base/lang", "dojo/on", "esri/layers/support/Field",]);

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
        id: 'properties',
        listMode: "hide"
      });

      var tempObject = new Field({
        alias: "Index",
        name: "Index",
        type: "esriFieldTypeInteger"
      });

      /* this._map.on("layer-add", lang.hitch(this, function (evt) {
         featureLayer.fields.push(tempObject);
         console.log(featureLayer);
       }))*/

      this.newMethod(featureLayer);
      this.view.whenLayerView(featureLayer).then(layerView => {
        //console.log(layerView);

        layerView.watch("updating", val => {
          if (!val) {

            // wait for the layer view to finish updating
            layerView.queryFeatures({
              outFields: layerView.availableFields
            }).then(results => {

              this.getResults(results);

              return results;

            });
          }
        });
      });

      /**************************Highlight Point************************************ */
      const newView = this.view;
      this.view.whenLayerView(featureLayer).then(function (layerView) {
        // this.getResultsData();
        let highlight;
        newView.on("click", function (event) {

          newView.hitTest(event.screenPoint).then(function (event) {

            var graphics = event.results;
            const result = graphics[0].graphic;
            console.log(result);
            if (highlight) {
              highlight.remove();
            }
            highlight = layerView.highlight(result);
            // this.MapData.push(result.attributes.OBJECTID)
            console.log("ss");
            //highlight = layerView.highlight(result);
            // const objIds = result.attributes.OBJECTID;
            // this.sharedService.selectedRow = this.objIds;
            this.selectedRow.highlight(this.objIds);
            this.sharedService.pointData.next(this.objIds);

          });
        });
      });


      function getResultsData() {
        console.log("fdsf");
      }
      /***************************End Highlight******************************************/
    } catch (error) {
      console.log("EsriLoader: ", error);
    }

  }//End Map

  /*******************Get Map Record********** */


  getResultsData() {
    console.log("woo");
  }

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
    //console.log(ELEMENT_DATA);
    return { ELEMENT_DATA: ELEMENT_DATA, FieldData: FieldData };
  }
  /***********************END****************** */

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

  private newMethod(featureLayer: any) {
    // console.log(featureLayer);
    this._map.add(featureLayer);

  };

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

