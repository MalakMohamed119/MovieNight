import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'https://api.themoviedb.org/3';
  private accessToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTIzZThkNjA5YjY1ZWM4YjA2YTU5ZTQ4MGExMTg4NCIsIm5iZiI6MTc1NDgyMjE2Ni45MzIsInN1YiI6IjY4OTg3NjE2NTc3ODY5NWY5ZmUyNDhjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DJblJbuF28DoNKwspNS6KOg0M4KDA2q7KyoQ9EcLDgs';

  constructor(private http: HttpClient) {}

  getTrendingMovies(page: number = 1): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/trending/movie/week?page=${page}`, { headers });
  }

  getRecommendedMovies(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/trending/movie/week?page=1`, { headers });
  }

  getMovieDetails(movieId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/movie/${movieId}`, { headers });
  }

  getMovieRecommendations(movieId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/movie/${movieId}/recommendations`, { headers });
  }
}
