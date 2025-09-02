import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';



import {map,catchError, Observable, throwError} from 'rxjs'

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
  error = signal('')

  ngOnInit(): void {
      this.isFetchingData.set(true)
      const subs = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places')
      .pipe(
        map((resData) => resData.places),
        catchError((error) => {
          console.log('err:',error)
          return throwError( () => {
            return new Error("Something went wrong while fetching data")
          })
        })
      )
      .subscribe(
        {
          next: (places) => {
            console.log('places:',places);
            this.places.set(places)
          },
          error: (error:Error) => {
            console.log("Error occured",error);
            this.error.set(error.message)
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
