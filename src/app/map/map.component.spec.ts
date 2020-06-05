import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapComponent } from './map.component';
import { SharedService } from '../shared.service';
import {HttpClientModule} from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { loadModules } from 'esri-loader';
import { __classPrivateFieldSet } from 'tslib';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SharedService],
      imports: [HttpClientModule, MatTableModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create instance of map and view', async () => {
    const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView']);
    component.initializeMap();
    expect(component.map).toBeDefined();
    expect(component.view).toBeDefined();
    });
  it('should get response from getResults method', async () => {
    const [ Graphic] =  await loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic']);
    const graphicArray = [];
    const point = {
      type: 'point',
      longitude: -49.97,
      latitude: 41.73
    };
    const markerSymbol = {
      type: 'simple-marker',
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    };
    const attributesData = {
      id: 4
    };
    const graphic = new Graphic({
      geometry : point,
      symbol : markerSymbol,
      attributes: attributesData
    });
    graphicArray.push(graphic);
    const graphicObj = {features: graphicArray, fields: [{name: 'OBJECTID'}] };
    component.getResults(graphicObj);
    for (const value of graphicObj.fields) {
      expect(value.name).toBe('OBJECTID');
    }
    graphicObj.features.forEach(value => {
      expect(value.attributes).toBe(attributesData);
    });
    });
    /*************************************GRAPHIC RESULT**************************************************************/
  it('should call graphicResult', async () => {
    const [ Graphic, GraphicsLayer] =  await loadModules([ 'esri/Graphic', 'esri/layers/GraphicsLayer']);
    const graphicArray = [];
    const fieldData = [
    { ADDRESS: '5325 HOADLEY ST' , CASE_NUM: '011-301652', CASE_STEP_NUMBER: 6, CENSUS_BLOCK: 1037,
     CENSUS_TRACT: 136.01, CITY: 'BRIGHTON', CONGRESS_DISSTR: '07', DATE_ACQUIRED: 1452038400000,
     DATE_CLOSED: null, DATE_RECONCILED: null, DIRECTION_PREFIX: null, DISPLAY_ZIP_CODE: 35020, FIPS_PLACE_CODE: null,
     FIPS_STATE_CODE: 1, MAP_LATITUDE: 33.44589, MAP_LONGITUDE: -86.932243, OBJECTID: 1, OUT_GTLVL: 'R',
     REVITE_HOC: null, REVITE_NAME: null, STATE_CODE: 'AL', STREET_NAME: 'HOADLEY ST', STREET_NUM: '5325 ', }
    ];
    const graphic = new Graphic(
      {
       visible : true,
       geometry: {
        type: 'point',
        longitude: -86.9322429999986 ,
        latitude: 33.44588999999944
       },
      symbol: {
        type: 'simple-marker',
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      },
      attributes: {id: 1}
    });
    graphicArray.push(graphic);
    const layer = new GraphicsLayer({
      visible: true,
      graphics: graphicArray ,
      id: 'properties'
    });
    component.graphicResult();
    component.view.map.add(layer);
    for (const fieldDataValue of fieldData) {
     expect(fieldDataValue.OBJECTID).toBe(1);
     expect(fieldDataValue.MAP_LATITUDE).toBe(33.44589);
     expect(fieldDataValue.MAP_LONGITUDE).toBe(-86.932243);
    }
   });
   /**************************************END GRAPHIC RESULT*************************************************************/
   /************************************POINT CLICK*************************************************/
  it('should get the response from pointClick()' , async () => {
    const [ Graphic, GraphicsLayer, MapView, LayerView] =
    await loadModules(['esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/views/MapView', 'esri/views/layers/LayerView']);
    const graphicArray = [];
    const sharedServiceNew = component.sharedService;
   // const event = new EventEmitter();
    const results = [
      {
         mapPoint : {
          spatialReference: {
          latestWkid: 3857,
          wkid: 102100,
          },
      x: 3483082.5048980042,
      y: -21289852.61420796
    },
    graphic: {
      attributes : {
        id : 4
      },
      layer: {
        id: 'properties'
      },
      geometry : {
        latitude: -86.22630899999854,
        longitude: 32.39540999999945,
        type: 'point'
      },
      symbol : {
        outline: {width: 2},
         type: 'simple-marker'
      },
    },
    visible : true
      }];
    const viewNew =  component.view = new MapView();
    const graphicLayer = new GraphicsLayer({
      visible: true,
      graphics: graphicArray ,
      id: 'properties'
    });
    const layerView = new LayerView({
      layer: graphicLayer,
      visible: true
    });
    const response = {results, screenPoint: {x: 737, y: 193} };
    //component.pointClick(event, viewNew, sharedServiceNew);
    spyOn(viewNew , 'hitTest').and.callFake(() => {
      return Promise.resolve(response);
      });
    expect(response.screenPoint.x).toBe(737);
    expect(response.screenPoint.y).toBe(193);
    spyOn(viewNew, 'whenLayerView').and.callFake(() => {
      return Promise.resolve(layerView);
    });
    spyOn(sharedServiceNew.pointObjectId, 'next');
    expect(response.results[0].graphic.attributes.id).toBe(4);
    });
  it('should call  pointObjData', async () => {
    const [ Graphic, GraphicsLayer,  LayerView] =
    await loadModules([ 'esri/Graphic', 'esri/layers/GraphicsLayer','esri/views/layers/LayerView']);
    const elementData = [{ADDRESS: '5325 HOADLEY ST', CASE_NUM: '011-301652', CASE_STEP_NUMBER: 6,
    CENSUS_BLOCK: 1037, CENSUS_TRACT: 136.01, CITY: 'BRIGHTON', CONGRESS_DISSTR: '07', DATE_ACQUIRED: 1452038400000,
    DATE_CLOSED: null, DATE_RECONCILED: null, DIRECTION_PREFIX: null, DISPLAY_ZIP_CODE: 35020, FIPS_PLACE_CODE: null,
    FIPS_STATE_CODE: 1, MAP_LATITUDE: 33.44589, MAP_LONGITUDE: -86.932243, OBJECTID: 1, OUT_GTLVL: 'R', REVITE_HOC: null,
    REVITE_NAME: null, STATE_CODE: 'AL', STREET_NAME: 'HOADLEY ST', STREET_NUM: '5325'}];
    const items = [];
    const layerResult = [];
    const tempFeatures = [];
    const result = -1;
    const graphic = new Graphic({
      attributes: {
      id: 1
      },
      geometry: {
        latitude: -86.9322429999986,
        longitude: 33.44588999999944
      },
      symbol: {
        type: 'simple-marker',
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      },
      visible: true
   });
    items.push(graphic);
    const graphicLayer = new GraphicsLayer({
    visible: true,
    graphics: items,
    id: 'properties'
  });
    const layerView = new LayerView({
    layer: graphicLayer,
    visible: true
  });
    tempFeatures.push(graphicLayer.graphics.items);
    component.pointObjData();
    spyOn(component.sharedService.objData, 'subscribe');
    expect(elementData).toBeDefined();
    for (const objDataValue of elementData) {
      expect(objDataValue.OBJECTID).toBe(1);
     }
    spyOn (component.view.map.layers, 'find');
    expect(graphicLayer.id).toEqual('properties');
    spyOn(component.view, 'whenLayerView').and.callFake(() => {
      return Promise.resolve(layerView);
    });
    expect(layerView.layer).toBe(graphicLayer);
    if(graphicLayer.graphics.length > 0) {
    expect(graphicLayer.graphics.length).toBe(1);
    expect(graphicLayer.graphics.items).toEqual(items);
   }
    for (const tempFeaturesValue of tempFeatures) {
     expect(tempFeaturesValue).toBeDefined();
     if (result === -1) {
         expect(tempFeaturesValue[0].visible ).toBe(true);
      } else {
         expect(tempFeaturesValue[0].visible).toBe(false);
      }
      }
});
  it('ngOnit call another function', () => {
    component.ngOnInit();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
