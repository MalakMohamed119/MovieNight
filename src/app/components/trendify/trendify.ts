import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MovieService } from '../../services/movie';
import { WishlistService } from '../../services/wishlist';
import { ContentFilterService } from '../../services/content-filter';

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
  isSearchMode = false;
  searchResults: any[] = [];
  searchTotalPages = 1;
  searchPage = 1;

  constructor(
    private movieService: MovieService,
    private wishlist: WishlistService,
    private router: Router,
    private contentFilter: ContentFilterService
  ) {}

  ngOnInit() {
    this.loadTrendingMovies();
  }

  loadTrendingMovies(page: number = this.page) {
    // Load 6 pages to ensure we have enough content after filtering
    const startPage = Math.ceil(page * 6 - 5);
    const pages = [startPage, startPage + 1, startPage + 2, startPage + 3, startPage + 4, startPage + 5];

    Promise.all(
      pages.map(p => firstValueFrom(this.movieService.getTrendingMovies(p)))
    )
      .then((responses) => {
        // Combine all results
        const allResults = responses.reduce((acc, data) => {
          return [...acc, ...(data?.results || [])];
        }, []);
        
        this.movies = allResults;
        // Adjust total pages since we're loading more pages per "logical" page
        const totalApiPages = responses[0]?.total_pages || 1;
        this.totalPages = Math.max(1, Math.ceil(totalApiPages / 4));
        this.page = page;
      })
      .catch((error) => {
        console.error('Error fetching trending movies:', error);
      });
  }

  get filteredMovies() {
    if (this.isSearchMode) {
      return this.contentFilter.filterMovies(this.searchResults);
    }
    
    // Show trending movies when not in search mode with family-friendly filtering
    return this.contentFilter.filterMovies(this.movies);
  }

  async performSearch(query: string) {
    if (!query || query.length < 2) {
      this.isSearchMode = false;
      return;
    }

    try {
      // Load multiple pages of search results to ensure enough content after filtering
      const pagesToLoad = Math.min(3, 500); // Load up to 3 pages
      const searchPromises = [];
      
      for (let i = 0; i < pagesToLoad; i++) {
        const pageNum = this.searchPage + i;
        if (pageNum <= 500) { // API limit
          searchPromises.push(firstValueFrom(this.movieService.searchMovies(query, pageNum)));
        }
      }
      
      const responses = await Promise.all(searchPromises);
      
      // Combine all search results
      this.searchResults = responses.reduce((acc, response) => {
        return [...acc, ...(response?.results || [])];
      }, []);
      
      this.searchTotalPages = Math.min(responses[0]?.total_pages || 1, 500);
      this.isSearchMode = true;
    } catch (error) {
      console.error('Error searching movies:', error);
      this.isSearchMode = false;
    }
  }

  truncateDescription(text: string, wordLimit: number = 10): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  prevPage() {
    if (this.isSearchMode) {
      if (this.searchPage > 1) {
        this.searchPage--;
        this.performSearch(this.searchQuery);
      }
    } else {
      if (this.page > 1) this.loadTrendingMovies(this.page - 1);
    }
  }

  nextPage() {
    if (this.isSearchMode) {
      if (this.searchPage < this.searchTotalPages) {
        this.searchPage++;
        this.performSearch(this.searchQuery);
      }
    } else {
      if (this.page < this.totalPages) this.loadTrendingMovies(this.page + 1);
    }
  }

  goToPage(pageNum: number) {
    if (this.isSearchMode) {
      if (pageNum >= 1 && pageNum <= this.searchTotalPages) {
        this.searchPage = pageNum;
        this.performSearch(this.searchQuery);
      }
    } else {
      if (pageNum >= 1 && pageNum <= this.totalPages) {
        this.loadTrendingMovies(pageNum);
      }
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const currentPage = this.isSearchMode ? this.searchPage : this.page;
    const maxPages = this.isSearchMode ? this.searchTotalPages : this.totalPages;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(maxPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get currentPage(): number {
    return this.isSearchMode ? this.searchPage : this.page;
  }

  get currentTotalPages(): number {
    return this.isSearchMode ? this.searchTotalPages : this.totalPages;
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

  onSearchInput() {
    const query = this.searchQuery.trim();
    if (query.length >= 2) {
      this.searchPage = 1; // Reset to first page for new search
      this.performSearch(query);
    } else if (query.length === 0) {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.searchResults = [];
    this.searchPage = 1;
  }
}
