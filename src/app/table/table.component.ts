import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, Sort, } from '@angular/material';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-table-row',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit, AfterViewInit {


  @ViewChild('paginatorPos', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() ELEMENT_DATA: any[];
  @Input() FieldData: any;
  objectID: any;
  objDatas: any[] = [];
  @Input() pointData: any;
  SelectedRow: any;
  dataSource = new MatTableDataSource<any>();


  constructor(public sharedService: SharedService) { }
  cellClicked(row) {
    console.log(row);
    let val = 'OBJECTID'
    this.sharedService.objectID.next(row.OBJECTID);
    this.SelectedRow = row[val];

  }
  isSorting(columnText: string): boolean {
    console.log(columnText);
    return true;
  }

  pagedata() {

    this.paginator.pageSize = 5;
    const skip = this.paginator.pageSize * this.paginator.pageIndex;
    const paged = this.FieldData.filter((u, i) => i >= skip)
      .filter((u, i) => i < this.paginator.pageSize);
    this.objDatas.push(paged);
    this.sharedService.objData.next(paged);
    //console.log(this.objDatas);

  }

  ngOnInit() {

    this.SelectedRow = this.sharedService.SelectedRow;
    this.sharedService.ELEMENT_DATA.subscribe(elementData => {
      this.ELEMENT_DATA = elementData;
    });

    this.sharedService.pointData.subscribe(filterData => {
      this.pointData = filterData;
    });

    this.sharedService.FieldData.subscribe(fieldData => {
      this.FieldData = JSON.parse(JSON.stringify(fieldData));
      this.dataSource = new MatTableDataSource(this.FieldData);
      this.dataSource.paginator = this.paginator;
    });




    this.FieldData = JSON.parse(JSON.stringify(this.FieldData));




    /***************Map Data************* */
    this.dataSource = new MatTableDataSource(this.FieldData);

    setTimeout(() => {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 5;
      this.dataSource.paginator = this.paginator;
    });

    this.pagedata();



  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
