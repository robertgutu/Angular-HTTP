import { inject, Injectable, signal } from '@angular/core';
import {map,catchError, Observable, throwError,tap} from 'rxjs'
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../shared/error.service';


@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient=inject(HttpClient)
  private userPlaces = signal<Place[]>([]);
  private errorService = inject(ErrorService)

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
    const prevPlaces = this.userPlaces();

    if(!prevPlaces.some((p) => p.id === place.id)){ 
      this.userPlaces.set([...prevPlaces, place])
    }
    
    return this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id
      }).pipe(
        catchError(error => {
          this.userPlaces.set(prevPlaces)
          this.errorService.showError('Failed to store selected place!!!')
          return throwError(() => new Error('Failed to store selected place.'))
        })
      );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces(); 
    
    const newPlaces = [...prevPlaces].filter(el => el.id !== place.id)

    if(prevPlaces.some((p) => p.id === place.id)){ 
      this.userPlaces.set(newPlaces)
    }

    return this.httpClient.delete(`http://localhost:3000/user-places/${place.id}`).pipe(
      catchError(error => {
        this.userPlaces.set(newPlaces)
        this.errorService.showError('Failed to delete selected place!!!')
        return throwError(() => new Error('Failed to delete selected place.'))
      })
    )
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
