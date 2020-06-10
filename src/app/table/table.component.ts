import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-table-row',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit, AfterViewInit {


  @ViewChild('paginatorPos', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() headers: any[];
  @Input() fieldData: any[] = [];
  @Input() pointData: any[] = [];
  @Input() pointObjectId: any;
  @Input() filterResult: any;
  objectID: any;
  SelectedRow: any;
  data: any;
  clickData: any;
  filterRecord: any;
  dataSource = new MatTableDataSource<any>();


  constructor(public sharedService: SharedService) { }
  cellClicked(row) {
    const val = 'OBJECTID';
    this.sharedService.objectID.next(row.OBJECTID);
    this.SelectedRow = row[val];

  }
  pagedata(event, pageIndex = 0)  {
    let pageIndexId = pageIndex;
    if (event !== '') {
      pageIndexId = event.pageIndex;
    }

    this.paginator.pageSize = 5;
    const skip = this.paginator.pageSize * pageIndexId;
    const paged = this.fieldData.filter((u: any, i: number) => i >= skip)
      .filter((u, i) => i < this.paginator.pageSize);
    this.sharedService.objData.next(paged);
  }
  applyFilter(filterValue) {
    this.dataSource = new MatTableDataSource(this.fieldData);
    const filterValueData = JSON.stringify(filterValue);
    this.dataSource.filter = filterValueData.trim().toLowerCase();
    console.log(filterValue);
    console.log(this.dataSource.filter);
    const filteredData = this.dataSource.filteredData;
    console.log(filteredData);
    this.sharedService.filterRecord.next(filteredData);

  }

  ngOnInit() {

    this.SelectedRow = this.sharedService.SelectedRow;
    this.sharedService.headers.subscribe(elementData => {
      this.headers = elementData;
    });

    this.sharedService.pointObjectId.subscribe(pointObId => {
    this.SelectedRow = pointObId;
    } , err => {console.log(err); });


    this.sharedService.fieldData.subscribe(
      fieldData => {
      this.fieldData = fieldData;
      this.dataSource = new MatTableDataSource(this.fieldData);
      this.dataSource.paginator = this.paginator;
    }, err => {console.log(err); } );

    this.dataSource = new MatTableDataSource(this.fieldData);
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.dataSource.paginator = this.paginator;
    this.pagedata('', this.paginator.pageIndex);

    this.sharedService.filterResult.subscribe(filterValue => {
     this.clickData = filterValue;
     this.applyFilter(filterValue);
      } , err => {console.log(err); });

  }

 ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
