import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentFilterService {
  // TMDb genre IDs to filter out for family-friendly content
  private restrictedGenres = [
    10749, // Romance (only this one for halal requirement)
    27     // Horror (too scary)
    // Note: Removed Crime, Thriller, Drama to allow more variety
    // Only blocking Romance (for halal) and Horror (too scary)
  ];

  // Movie ratings to filter out (R-rated, NC-17, etc.)
  private restrictedRatings = [
    'R',
    'NC-17',
    'X',
    'Unrated',
    '18',
    '17+',
    'TV-MA',
    'M'
  ];

  // Keywords that suggest inappropriate content (very basic filtering)
  private restrictedKeywords = [
    'erotic', 'adult', 'sexy', 'nude', 'strip'
    // Removed many keywords to be less restrictive
    // Only filtering obvious adult content
  ];

  constructor() {}

  /**
   * Filter movies based on family-friendly criteria
   */
  filterMovies(movies: any[]): any[] {
    return movies.filter(movie => this.isMovieAppropriate(movie));
  }

  /**
   * Check if a single movie is appropriate for family viewing
   */
  isMovieAppropriate(movie: any): boolean {
    // Check genre restrictions
    if (this.hasRestrictedGenres(movie)) {
      return false;
    }

    // Skip rating restrictions for now (most API movies don't have this data)
    // if (this.hasRestrictedRating(movie)) {
    //   return false;
    // }

    // Check title and overview for inappropriate content
    if (this.hasRestrictedContent(movie)) {
      return false;
    }

    // Check vote average - filter out movies with very low ratings (likely poor quality)
    if (movie.vote_average && movie.vote_average < 2.0) {
      return false;
    }

    return true;
  }

  /**
   * Check if movie has restricted genres
   */
  private hasRestrictedGenres(movie: any): boolean {
    if (!movie.genre_ids) return false;
    return movie.genre_ids.some((genreId: number) => 
      this.restrictedGenres.includes(genreId)
    );
  }

  /**
   * Check if movie has restricted rating
   */
  private hasRestrictedRating(movie: any): boolean {
    if (!movie.certification && !movie.release_dates) return false;
    
    // Check certification
    if (movie.certification) {
      return this.restrictedRatings.includes(movie.certification);
    }

    // Check release dates for US certification
    if (movie.release_dates && movie.release_dates.results) {
      const usRelease = movie.release_dates.results.find((country: any) => country.iso_3166_1 === 'US');
      if (usRelease && usRelease.release_dates && usRelease.release_dates[0]) {
        const certification = usRelease.release_dates[0].certification;
        return this.restrictedRatings.includes(certification);
      }
    }

    return false;
  }

  /**
   * Check if movie title or overview contains inappropriate content
   */
  private hasRestrictedContent(movie: any): boolean {
    const textToCheck = [
      movie.title?.toLowerCase() || '',
      movie.overview?.toLowerCase() || '',
      movie.tagline?.toLowerCase() || ''
    ].join(' ');

    return this.restrictedKeywords.some(keyword => 
      textToCheck.includes(keyword.toLowerCase())
    );
  }

  /**
   * Get list of allowed genres for family-friendly content
   */
  getAllowedGenres(): number[] {
    // Common family-friendly genres
    return [
      16,  // Animation
      35,  // Comedy
      10751, // Family
      14,  // Fantasy
      10402, // Music
      9648, // Mystery (mild)
      12,  // Adventure
      28,  // Action (mild)
      878, // Science Fiction
      99,  // Documentary
      36,  // History
      10752 // War (historical context)
    ];
  }

  /**
   * Update restricted genres (admin function)
   */
  updateRestrictedGenres(genres: number[]): void {
    this.restrictedGenres = genres;
  }

  /**
   * Get current restricted genres
   */
  getRestrictedGenres(): number[] {
    return [...this.restrictedGenres];
  }
}
