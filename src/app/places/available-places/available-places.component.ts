import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

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

  ngOnInit(): void {
      const subs = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
        observe: 'response'
      })
      .subscribe(
        {
          next: (response) => {
            console.log('resData:',response.body?.places);
            const responseData = response.body?.places
            this.places.set(responseData)
          }
        }
      )

      this.destroyRef.onDestroy( () => {   
          subs.unsubscribe();
        } 
      )
  }; 

}
