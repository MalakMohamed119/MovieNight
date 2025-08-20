import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WishlistItem {
  id: number;
  title: string;
  poster_path: string;
  vote_average?: number;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private storageKey = 'wishlist_movies';
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>(this.loadFromStorage());

  wishlist$ = this.wishlistSubject.asObservable();

  private loadFromStorage(): WishlistItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: WishlistItem[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {}
  }

  getAll(): WishlistItem[] {
    return this.wishlistSubject.value;
  }

  isInWishlist(id: number): boolean {
    return this.wishlistSubject.value.some(i => i.id === id);
  }

  add(item: WishlistItem) {
    if (this.isInWishlist(item.id)) return;
    const next = [...this.wishlistSubject.value, item];
    this.wishlistSubject.next(next);
    this.saveToStorage(next);
  }

  remove(id: number) {
    const next = this.wishlistSubject.value.filter(i => i.id !== id);
    this.wishlistSubject.next(next);
    this.saveToStorage(next);
  }

  toggle(item: WishlistItem) {
    if (this.isInWishlist(item.id)) {
      this.remove(item.id);
    } else {
      this.add(item);
    }
  }
} 