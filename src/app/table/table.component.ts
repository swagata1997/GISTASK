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
  @Input() fieldData: any;
  @Input() pointData: any;
  @Input() pointObjectId: any;
  objectID: any;
  SelectedRow: any;
  dataSource = new MatTableDataSource<any>();


  constructor(public sharedService: SharedService) { }
  cellClicked(row) {
    const val = 'OBJECTID';
    this.sharedService.objectID.next(row.OBJECTID);
    this.SelectedRow = row[val];

  }
  pagedata = (event, pageIndex = 0) => {
    let pageIndexId = pageIndex;
    if (event !== '') {
      pageIndexId = event.pageIndex;
    }

    this.paginator.pageSize = 5;
    const skip = this.paginator.pageSize * pageIndexId;
    const paged = this.fieldData.filter((V: any , i: number) => i >= skip)
      .filter(( V: any, i: number) =>   i < this.paginator.pageSize);
    this.sharedService.objData.next(paged);
    return true;
  }

  ngOnInit() {

    this.SelectedRow = this.sharedService.SelectedRow;
    this.sharedService.headers.subscribe(elementData => {
      this.headers = elementData;
    });

    this.sharedService.pointData.subscribe(filterData => {
      this.pointData = filterData;
    });
    this.sharedService.pointObjectId.subscribe(pointObId => {
      this.pointObjectId = pointObId;
      this.SelectedRow = pointObId;
    });


    this.sharedService.fieldData.subscribe(fieldData => {
    this.fieldData = fieldData;
    });
    this.dataSource = new MatTableDataSource(this.fieldData);
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.dataSource.paginator = this.paginator;
    this.pagedata('', this.paginator.pageIndex);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
