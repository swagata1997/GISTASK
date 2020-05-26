import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TableComponent } from './table.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material';
import { SharedService } from '../shared.service';
import {HttpClientModule} from '@angular/common/http';
describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ MatTableModule, MatInputModule, HttpClientModule],
      providers: [SharedService]
     })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
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
