import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-trendify',
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './trendify.html',
  styleUrl: './trendify.css'
})
export class Trendify implements OnInit {
  movies: any[] = [];
  searchQuery = '';
  page = 1;
  totalPages = 1;

  constructor(private movieService: MovieService, private wishlist: WishlistService) {}

  ngOnInit() {
    this.loadTrendingMovies();
  }

  loadTrendingMovies(page: number = this.page) {
    this.movieService.getTrendingMovies(page).subscribe({
      next: (data) => {
        this.movies = data.results || [];
        this.totalPages = Math.max(1, data.total_pages || 1);
        this.page = page;
      },
      error: (error) => {
        console.error('Error fetching trending movies:', error);
      }
    });
  }

  get filteredMovies() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.movies;
    return this.movies.filter((m: any) => (m.title || '').toLowerCase().includes(query));
  }

  truncateDescription(text: string, wordLimit: number = 10): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  prevPage() {
    if (this.page > 1) this.loadTrendingMovies(this.page - 1);
  }

  nextPage() {
    if (this.page < this.totalPages) this.loadTrendingMovies(this.page + 1);
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.loadTrendingMovies(pageNum);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleWishlist(movie: any) {
    this.wishlist.toggle({ id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average });
  }

  isWishlisted(movie: any) {
    return this.wishlist.isInWishlist(movie.id);
  }
}
