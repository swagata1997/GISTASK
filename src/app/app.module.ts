import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatAutocompleteModule, MatChipsModule, MatFormFieldModule } from '@angular/material';
import { TableComponent } from './table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from './shared.service'
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TableComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule,
    BrowserAnimationsModule, MatTableModule,
    MatInputModule, MatSortModule, HttpClientModule,
    MatPaginatorModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatAutocompleteModule, MatChipsModule,
    MatFormFieldModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
