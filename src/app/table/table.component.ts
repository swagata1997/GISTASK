import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SharedService } from '../shared.service';
import { element } from 'protractor';
@Component({
  selector: 'app-table-row',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() ELEMENT_DATA: any[];
  @Input() FieldData: any;
  dataSource = new MatTableDataSource<any>();

  constructor(public sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.ELEMENT_DATA.subscribe(elementData => {
      this.ELEMENT_DATA = elementData;
    });
    this.sharedService.FieldData.subscribe(fieldData => {
      this.FieldData = JSON.parse(JSON.stringify(fieldData));
      this.dataSource = new MatTableDataSource(this.FieldData);
      this.dataSource.paginator = this.paginator;
    });
    this.FieldData = JSON.parse(JSON.stringify(this.FieldData));
    this.dataSource = new MatTableDataSource(this.FieldData);

  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
  }

}
