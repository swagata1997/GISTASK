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
  it('should create instance of map', async () => {
    const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView']);
    const mapProperties = {
      basemap: 'topo'
    };
    component.map = new Map(mapProperties);
    const mapViewProperties = {
     map: component.map
    };
    component.view = new MapView(mapViewProperties);
    component.initializeMap();
    expect(component.map).toBe(mapProperties);
    expect(component.view).toBe(mapViewProperties);
    });
  it('should call getResults method', () => {
  const response = new response();
  const res = component.getResults(response);
  expect(res).toBe(response);
    });

  it('should call queryResult method', async () => {
    const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query',
       'esri/Graphic', 'esri/layers/GraphicsLayer']);
    const qtask = new  QueryTask({
      url : 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0'
    });
    const params = new Query({
      returnGeometry: true,
    });
    expect();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
