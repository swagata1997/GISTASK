import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapComponent } from './map.component';
import { SharedService } from '../shared.service';
import {HttpClientModule} from '@angular/common/http';
describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SharedService],
      imports: [HttpClientModule]
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
  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
