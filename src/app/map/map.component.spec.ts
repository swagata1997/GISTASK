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
      id: component.objId
    };
    const graphic = new Graphic({
      geometry : point,
      symbol : markerSymbol,
      attributes: attributesData
    });
    graphicArray.push(graphic);
    const graphicObj = {features: graphicArray, fields: [{name: 'OBJECTID'}] };
    component.getResults(graphicObj);
    for (let i = 0; i <= graphicObj.fields.length; i++) {
    expect( graphicObj.fields[i].name).toBe('OBJECTID');
    }
    for (let i = 0; i <= graphicObj.features.length; i++) {
      expect(graphicObj.features[i].objId).toBe(1);
     }
     });
  it('should call graphicResult', async () => {
    const [ Graphic, GraphicsLayer] =  await loadModules([ 'esri/Graphic', 'esri/layers/GraphicsLayer']);
    const graphicArray = [];
    // const graphic = new Graphic();
   // graphicArray.push(graphic);
    component.graphicResult();
    expect();
     });
  it('should call pointClick()' , async () => {
    const [ Graphic] =  await loadModules([ 'esri/Graphic']);
    const resultArray = [];
    const  viewNew = component.view;
   
    spyOn(viewNew, 'on').and.callFake(() => {
      component.pointClick(event, viewNew, sharedServiceNew);
      expect(component.pointClick(event, viewNew, sharedServiceNew)).toHaveBeenCalled();
    });
    spyOn(viewNew, 'hitTest').and.callFake(() => {
      });
    expect(viewNew.hitTest()).toHaveBeenCalled();
    const point = {
      type: 'point',
      longitude: -49.97,
      latitude: 41.73
    };
    const attributesData = {
      id: component.objId
    };

    const graphic = new Graphic({
      geometry : point,
      attributes : attributesData
    });

  });
  it('ngOnit call another function', () => {
    component.ngOnInit();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
