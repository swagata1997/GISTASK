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
    component.initializeMap();
    expect(component.map).toBeDefined();
    expect(component.view).toBeDefined();
    });
  it('should get response from getResults method', async () => {
    const [ Graphic] =  await loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic']);
    const graphicArray = [];
    const name = ['OBJECTID'];
    const attributes = ['5325 HOADLEY ST'];
    const graphic = new Graphic();
    const obj = {features: graphic , fields: [{}] };
    graphicArray.push(obj);
    component.getResults(obj);
    expect(component.headers).toBe(name);
    expect(component.fieldData).toBe(attributes);
   });
  it('should call graphicResult', async () => {
    const [ Graphic] =  await loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic']);
    const arrGraphic = [];
    const graphic = new Graphic();
    component.graphicResult();
    arrGraphic.push(graphic);
    expect(component.view.map ).toBeDefined();
  });
  it('ngOnit call another function', () => {
    component.ngOnInit();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
