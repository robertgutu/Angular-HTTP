import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map,catchError,throwError } from 'rxjs';

const apiUrl = 'http://localhost:3000'

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  userPlaces = signal<Place[]>([])
  isFetchingData = signal(false)
  error = signal('')

  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.isFetchingData.set(true)
    const url = `${apiUrl}/user-places`
    const subscribbe = this.httpClient.get<{ places: Place[] }>(url)
    .pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.log('err:',error)
        return throwError( () => {
          return new Error("Something went wrong while fetching user data")
        })
      })
    )
    .subscribe(
      {
        next: (res) => {
          console.log('places:',res);
          this.userPlaces.set(res)
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
  }
}
