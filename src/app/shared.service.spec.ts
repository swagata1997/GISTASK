import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule, MatTableModule, MatPaginatorModule, MatSortModule],
        providers: [SharedService],
        schemas: [NO_ERRORS_SCHEMA],
  }));

  it('should be created', () => {
    const service: SharedService = TestBed.get(SharedService);
    expect(service).toBeTruthy();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
 });
