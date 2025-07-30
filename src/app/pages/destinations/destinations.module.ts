import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DestinationsRoutingModule } from './destinations-routing.module';
import { DestinationsComponent } from './destinations/destinations.component';
import { CitiesComponent } from './cities/cities.component';
import { SummerComponent } from './summer/summer.component';
import { WinterComponent } from './winter/winter.component';
import { AdventuresComponent } from './adventures/adventures.component';
import { BookNowComponent } from './book-now/book-now.component';


@NgModule({
  declarations: [
    DestinationsComponent,
    CitiesComponent,
    SummerComponent,
    WinterComponent,
    AdventuresComponent,
    BookNowComponent
  ],
  imports: [
    CommonModule,
    DestinationsRoutingModule
  ]
})
export class DestinationsModule { }
