import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';



import {map} from 'rxjs'

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  isFetchingData = signal(false)

  ngOnInit(): void {
      this.isFetchingData.set(true)
      const subs = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places')
      .pipe(
        map((resData) => resData.places)
      )
      .subscribe(
        {
          next: (places) => {
            console.log('places:',places);
            this.places.set(places)
          },
          complete: () => {
            this.isFetchingData.set(false)
          }
        }
      )

      this.destroyRef.onDestroy( () => {   
          subs.unsubscribe();
        } 
      )
  }; 

}
