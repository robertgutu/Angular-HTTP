import { inject, Injectable, signal } from '@angular/core';
import {map,catchError, Observable, throwError} from 'rxjs'
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient=inject(HttpClient)

  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Something went wrong while fetching all places"'
    )
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Something went wrong while fetching user places"'
    )
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put( 
      'http://localhost:3000/user-places', 
      {
        placeId: placeId
      }
    ).subscribe(
      {
        next: (res) => console.log(res)
      }
    )
  }

  removeUserPlace(place: Place) {
    
  }

  private fetchPlaces(url:string, errorMsg:string) {
    return this.httpClient.get<{places: Place[]}>(url)
    .pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.log('err:',error)
        return throwError( () => {
          return new Error(errorMsg)
        })
      })
    )
  }
}
