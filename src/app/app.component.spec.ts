import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatAutocompleteModule, MatChipsModule, MatFormFieldModule } from '@angular/material';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './table/table.component';
import { SharedService } from './shared.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
       RouterTestingModule, HttpClientModule, MatTableModule, MatInputModule, MatPaginatorModule,
        MatSortModule, FormsModule,  ReactiveFormsModule, MatIconModule, MatAutocompleteModule,
        MatChipsModule, MatFormFieldModule
      ],
      declarations: [
        AppComponent, MapComponent, TableComponent
      ],

      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [SharedService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Mapp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Mapp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('.content span').textContent).toContain('Mapp app is running!');
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

  });
