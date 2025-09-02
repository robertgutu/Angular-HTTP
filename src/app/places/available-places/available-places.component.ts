import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';




const apiUrl = 'http://localhost:3000/'

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
  private placesService = inject(PlacesService)

  isFetchingData = signal(false)
  error = signal('')

  ngOnInit(): void {
      this.isFetchingData.set(true)
      const subs = this.placesService.loadAvailablePlaces().subscribe(
        {
          next: (places) => {
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

  onSelectPlace(place: Place){
    this.placesService.addPlaceToUserPlaces(place.id)
  }

}
