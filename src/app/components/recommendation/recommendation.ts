import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-recommendation',
  imports: [NgFor, NgIf],
  templateUrl: './recommendation.html',
  styleUrl: './recommendation.css'
})
export class Recommendation implements OnInit {
  recommendedMovies: any[] = [];
  loading = false;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadRecommendedMovies();
  }

  loadRecommendedMovies() {
    this.loading = true;
    this.movieService.getRecommendedMovies().subscribe({
      next: (data) => {
        this.recommendedMovies = data.results.slice(0, 6); // أول 6 أفلام فقط
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching recommended movies:', error);
        this.loading = false;
      }
    });
  }
}
