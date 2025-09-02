import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map,catchError,throwError } from 'rxjs';
import { PlacesService } from '../places.service';

const apiUrl = 'http://localhost:3000'

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  isFetchingData = signal(false)
  error = signal('')

  private destroyRef = inject(DestroyRef)
  private placesService = inject(PlacesService)

  userPlaces = this.placesService.loadedUserPlaces;

  ngOnInit(): void {
    this.isFetchingData.set(true)
    const subscribe = this.placesService.loadUserPlaces().subscribe(
      {
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
        subscribe.unsubscribe();
      } 
    )
  }

  onRemovePlace(placeToRemove: Place){
    console.log('test')
    this.placesService.removeUserPlace(placeToRemove).subscribe()
  }

}
