import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
    const graphic = new Graphic();
    graphicArray.push(graphic);
    const graphicObj = {features: graphicArray, fields: [{name: 'OBJECTID'}, {name: 'CASE_NUM'}] };
    component.getResults(graphicObj);
  
    // expect(component.headers).toEqual('OBJECTID');
     /* graphicObj.features.forEach(value => {
    // fieldData.push(value.attributes);
     expect(component.fieldData).toBe(value.attributes);
    });*/
   });

  it('should call graphicResult', async () => {
    const [ Graphic, GraphicsLayer] =  await loadModules([ 'esri/Graphic', 'esri/layers/GraphicsLayer']);
    const graphicArray = [];
    const graphic = new Graphic();
    graphicArray.push(graphic);
    component.graphicResult();
     });
  it('ngOnit call another function', () => {
    component.ngOnInit();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
