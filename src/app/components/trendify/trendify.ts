import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MovieService } from '../../services/movie';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-trendify',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './trendify.html',
  styleUrl: './trendify.css'
})
export class TrendifyComponent implements OnInit {
  movies: any[] = [];
  searchQuery = '';
  page = 1;
  totalPages = 1;

  constructor(
    private movieService: MovieService,
    private wishlist: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTrendingMovies();
  }

  loadTrendingMovies(page: number = this.page) {
    const firstPage = Math.ceil(page * 2 - 1);
    const secondPage = firstPage + 1;

    Promise.all([
      firstValueFrom(this.movieService.getTrendingMovies(firstPage)),
      firstValueFrom(this.movieService.getTrendingMovies(secondPage))
    ])
      .then(([firstData, secondData]) => {
        const firstResults = firstData?.results || [];
        const secondResults = secondData?.results || [];
        this.movies = [...firstResults, ...secondResults];
        this.totalPages = Math.max(1, Math.ceil((firstData?.total_pages || 1) / 2));
        this.page = page;
      })
      .catch((error) => {
        console.error('Error fetching trending movies:', error);
      });
  }

  get filteredMovies() {
    const query = this.searchQuery.trim().toLowerCase();
    let filtered = this.movies;

    filtered = filtered.filter((m: any) => !m.genre_ids?.includes(10749));

    if (!query) return filtered;
    return filtered.filter((m: any) => (m.title || '').toLowerCase().includes(query));
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
    this.wishlist.toggle({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average
    });
  }

  isWishlisted(movie: any) {
    return this.wishlist.isInWishlist(movie.id);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/500x750/1a1a1a/fbbf24?text=No+Image';
  }

  createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  goToMovieDetails(movieId: number, title: string) {
    const slug = this.createSlug(title);
    this.router.navigate(['/movie', movieId, slug]);
  }
}
