import { inject, Injectable, signal } from '@angular/core';
import {map,catchError, Observable, throwError,tap} from 'rxjs'
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
    console.log("loadUserPlaces")
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Something went wrong while fetching user places"'
    ).pipe(
      // tap allows to write some code similar with the one in subscribe() without using subscribe
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      })
    )
  }

  addPlaceToUserPlaces(place: Place) {

    this.userPlaces.update((prevUserPlaces) => [...prevUserPlaces, place])
    return this.httpClient.put( 
      'http://localhost:3000/user-places', 
      {
        placeId: place.id
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
