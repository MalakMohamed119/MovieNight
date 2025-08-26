import { Routes } from '@angular/router';
import { TrendifyComponent } from './components/trendify/trendify';
import { Wishlist } from './components/wishlist/wishlist';
import { MovieDetails } from './components/movie-details/movie-details';

export const routes: Routes = [
	{ path: 'trendify', component: TrendifyComponent },
	{ path: 'wishlist', component: Wishlist },
	{ path: 'movie/:id/:slug', component: MovieDetails },
	{ path: '', redirectTo: '/trendify', pathMatch: 'full' }
];
