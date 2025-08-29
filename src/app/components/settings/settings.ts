import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentFilterService } from '../../services/content-filter';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent implements OnInit {
  contentFilterEnabled = true;
  restrictedGenres: number[] = [];
  
  // Genre mappings for display
  genreMap: { [key: number]: string } = {
    10749: 'Romance',
    53: 'Thriller',
    27: 'Horror',
    80: 'Crime',
    18: 'Drama',
    16: 'Animation',
    35: 'Comedy',
    10751: 'Family',
    14: 'Fantasy',
    10402: 'Music',
    9648: 'Mystery',
    12: 'Adventure',
    28: 'Action',
    878: 'Science Fiction',
    99: 'Documentary',
    36: 'History',
    10752: 'War'
  };

  constructor(private contentFilter: ContentFilterService) {}

  ngOnInit() {
    this.restrictedGenres = this.contentFilter.getRestrictedGenres();
  }

  isGenreRestricted(genreId: number): boolean {
    return this.restrictedGenres.includes(genreId);
  }

  toggleGenreRestriction(genreId: number) {
    if (this.isGenreRestricted(genreId)) {
      this.restrictedGenres = this.restrictedGenres.filter(id => id !== genreId);
    } else {
      this.restrictedGenres.push(genreId);
    }
    this.contentFilter.updateRestrictedGenres(this.restrictedGenres);
  }

  getGenreName(genreId: number): string {
    return this.genreMap[genreId] || `Genre ${genreId}`;
  }

  resetToDefaults() {
    this.restrictedGenres = [10749, 53, 27, 80, 18]; // Default restricted genres
    this.contentFilter.updateRestrictedGenres(this.restrictedGenres);
  }

  getAllGenres(): number[] {
    return Object.keys(this.genreMap).map(Number);
  }
}
