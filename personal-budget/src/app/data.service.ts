import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any[] = [];
  private readonly apiUrl = 'http://localhost:3000/budget';

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    if (this.data.length > 0) {
      // Return data from the service if it's already loaded
      return of(this.data);
    } else {
      // Fetch data from the backend if it's not loaded
      return this.http.get<any>(this.apiUrl).pipe(
        map(response => {
          this.data = response.myBudget;
          return this.data;
        }),
        catchError(error => {
          console.error('Error fetching data', error);
          return of([]);
        })
      );
    }
  }
}
