import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../services/wishlist';

@Component({
  selector: 'app-wishlist',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist {
  items: WishlistItem[] = [];
  searchQuery = '';
  filteredItems: WishlistItem[] = [];

  constructor(private wishlist: WishlistService) {}

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
} 