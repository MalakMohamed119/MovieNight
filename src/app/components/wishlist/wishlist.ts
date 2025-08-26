import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { WishlistService, WishlistItem } from '../../services/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  items: WishlistItem[] = [];
  searchQuery = '';
  filteredItems: WishlistItem[] = [];

  constructor(private wishlist: WishlistService, private router: Router) {}

  ngOnInit() {
    this.items = this.wishlist.getAll();
    this.filteredItems = this.items;
    this.wishlist.wishlist$.subscribe(list => {
      this.items = list;
      this.filterItems();
    });
  }

  filterItems() {
    if (!this.searchQuery.trim()) {
      this.filteredItems = this.items;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredItems = this.items.filter(item => 
        item.title.toLowerCase().includes(query)
      );
    }
  }

  remove(id: number) {
    this.wishlist.remove(id);
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

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x450/1a1a1a/fbbf24?text=No+Image';
  }
}
