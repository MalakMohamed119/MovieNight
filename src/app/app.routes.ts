import { Routes } from '@angular/router';
import { Trendify } from './components/trendify/trendify';
import { Wishlist } from './components/wishlist/wishlist';

export const routes: Routes = [
	{ path: 'trendify', component: Trendify },
	{ path: 'wishlist', component: Wishlist },
	{ path: '', redirectTo: '/trendify', pathMatch: 'full' }


];
