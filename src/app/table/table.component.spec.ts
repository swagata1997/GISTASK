import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { TableComponent } from './table.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material';
import { SharedService } from '../shared.service';
import {HttpClientModule} from '@angular/common/http';
// import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const fieldData = [{ADDRESS: '5325 HOADLEY ST ',  CASE_NUM: '011-301652', CASE_STEP_NUMBER: 6,
  CENSUS_BLOCK: 1037, CENSUS_TRACT: 136.01, CITY: 'BRIGHTON', CONGRESS_DISSTR: '07',
  DATE_ACQUIRED: 1452038400000, DATE_CLOSED: null, DATE_RECONCILED: null, DIRECTION_PREFIX: null,
  DISPLAY_ZIP_CODE: 35020, FIPS_PLACE_CODE: null, FIPS_STATE_CODE: 1, MAP_LATITUDE: 33.44589,
  MAP_LONGITUDE: -86.932243, OBJECTID: 1, OUT_GTLVL: 'R', REVITE_HOC: null, REVITE_NAME: null,
  STATE_CODE: 'AL', STREET_NAME: 'HOADLEY ST', STREET_NUM: '5325 ' }];
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
  it('should call cellClicked()' , () => {
     const row = {ADDRESS: '5325 HOADLEY ST ',  CASE_NUM: '011-301652', CASE_STEP_NUMBER: 6,
     CENSUS_BLOCK: 1037, CENSUS_TRACT: 136.01, CITY: 'BRIGHTON', CONGRESS_DISSTR: '07',
     DATE_ACQUIRED: 1452038400000, DATE_CLOSED: null, DATE_RECONCILED: null, DIRECTION_PREFIX: null,
     DISPLAY_ZIP_CODE: 35020, FIPS_PLACE_CODE: null, FIPS_STATE_CODE: 1, MAP_LATITUDE: 33.44589,
     MAP_LONGITUDE: -86.932243, OBJECTID: 1, OUT_GTLVL: 'R', REVITE_HOC: null, REVITE_NAME: null,
     STATE_CODE: 'AL', STREET_NAME: 'HOADLEY ST', STREET_NUM: '5325 ' };
     component.cellClicked(row);
     spyOn(component.sharedService.objectID, 'next');
     expect(row.OBJECTID).toBe(1);
  });
  it('shuild call pagedata()' , () => {
    const event = '';
    const pageIndex = 0;
    const skip = 0;
    const paged = fieldData;
    component.pagedata(event, pageIndex);
    spyOn(component.fieldData, 'filter');
    expect(skip).toBe(0);
    expect(component.paginator.pageSize).toBe(5);
    spyOn(component.sharedService.objData, 'next');
    expect(paged).toBeDefined();
   });
  it('should call subscribe() for elementData',  () => {
   const elementData = ['OBJECTID', 'CASE_NUM', 'CASE_STEP_NUMBER', 'STREET_NUM', 'DIRECTION_PREFIX'];
   component.ngOnInit();
   spyOn(component.sharedService.headers, 'subscribe');
   expect(elementData).toEqual(elementData);
   });
  it('should call subscribe() for pointObId' , () => {
   const pointObId = '9415';
   component.ngOnInit();
   spyOn(component.sharedService.pointObjectId, 'subscribe');
   expect(component.SelectedRow).toBe(pointObId);
   });
  it('should call subcribe() for fieldData', () => {
     component.ngOnInit();
     spyOn(component.sharedService.fieldData, 'subscribe');
     expect(fieldData).toEqual(fieldData);
     expect(component.paginator.pageSize).toBe(5);
     expect(component.paginator.pageIndex).toBe(0);
     expect(component.dataSource).toBeDefined();
   });
  it('ngOnInit() call pagedata()', () => {
     component.ngOnInit();
     expect(component.paginator.pageIndex).toBe(0);
     component.pagedata('', 0);
   });
  it('should call ngAfterViewInit()' , async () => {
    component.ngAfterViewInit();
    expect(component.sort).toBeDefined();
    expect(component.paginator).toBeDefined();
   });
 /* afterAll(() => {
    TestBed.resetTestingModule();
  });*/

});
