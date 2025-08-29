import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentFilterService {
  // TMDb genre IDs to filter out for halal/family-friendly content
  private restrictedGenres = [
    10749, // Romance - NOT HALAL
    27,    // Horror - Too violent/scary
    53,    // Thriller - Often contains inappropriate content
    80,    // Crime - Often contains violence/inappropriate content
    18,    // Drama - Often contains mature themes/romance
    9648,  // Mystery - Often contains dark themes
    35     // Comedy - Can contain inappropriate humor/content
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

  // Keywords that suggest inappropriate content - COMPREHENSIVE HALAL FILTERING
  private restrictedKeywords = [
    // Romance/Sexual content - NOT HALAL
    'romance', 'romantic', 'love', 'dating', 'relationship', 'marriage', 'wedding',
    'kiss', 'kissing', 'passion', 'seduction', 'affair', 'intimate', 'intimacy',
    'erotic', 'adult', 'sexy', 'nude', 'strip', 'sensual', 'sexual',
    
    // Violence/Crime - NOT APPROPRIATE
    'murder', 'kill', 'killer', 'death', 'violence', 'violent', 'blood', 'gore',
    'crime', 'criminal', 'gang', 'mafia', 'drugs', 'drug', 'alcohol', 'drunk',
    'gambling', 'casino', 'bet', 'weapon', 'gun', 'shooting', 'fight', 'war',
    
    // Dark/Horror themes - NOT APPROPRIATE
    'horror', 'scary', 'haunted', 'ghost', 'demon', 'evil', 'dark', 'nightmare',
    'thriller', 'suspense', 'mystery', 'psychological',
    
    // Comedy/Humor - NOT APPROPRIATE
    'comedy', 'funny', 'humor', 'humour', 'joke', 'jokes', 'parody', 'satire',
    'laughs', 'hilarious', 'comic', 'comedian', 'amusing',
    
    // Inappropriate themes
    'revenge', 'betrayal', 'deception', 'lie', 'cheat', 'steal', 'corruption'
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
    // POSITIVE FILTERING: Only allow movies with safe genres
    if (!this.hasSafeGenres(movie)) {
      return false;
    }

    // Check genre restrictions (additional safety)
    if (this.hasRestrictedGenres(movie)) {
      return false;
    }

    // Check title and overview for inappropriate content
    if (this.hasRestrictedContent(movie)) {
      return false;
    }

    // Check vote average - must have decent quality
    if (movie.vote_average && movie.vote_average < 4.0) {
      return false;
    }

    return true;
  }

  /**
   * Check if movie has at least one safe/family-friendly genre
   */
  private hasSafeGenres(movie: any): boolean {
    if (!movie.genre_ids || movie.genre_ids.length === 0) return false;
    
    const safeGenres = [
      16,    // Animation - SAFE
      10751, // Family - SAFE
      14,    // Fantasy - SAFE
      10402, // Music - SAFE
      12,    // Adventure - SAFE (if clean)
      878,   // Science Fiction - SAFE (if clean)
      99,    // Documentary - SAFE
      36,    // History - SAFE
      // REMOVED: Comedy (35) - can contain inappropriate humor
      // REMOVED: Romance (10749) - not halal
    ];
    
    return movie.genre_ids.some((genreId: number) => 
      safeGenres.includes(genreId)
    );
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
