import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './shared/layouts/default-layout/default-layout';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)},
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)},
      { path: 'artist/new', loadComponent: () => import('./pages/artist-form/artist-form').then(m => m.ArtistFormComponent)},
      { path: 'artist/:id/edit', loadComponent: () => import('./pages/artist-form/artist-form').then(m => m.ArtistFormComponent)},
      { path: 'artist/:id', loadComponent: () => import('./pages/artist-detail/artist-detail').then(m => m.ArtistDetailComponent)},
      { path: 'albums', loadComponent: () => import('./pages/album-list/album-list').then(m => m.AlbumListComponent)},
      { path: 'album/new', loadComponent: () => import('./pages/album-form/album-form').then(m => m.AlbumFormComponent)},
      { path: 'album/:id/edit', loadComponent: () => import('./pages/album-edit/album-edit').then(m => m.AlbumEditComponent)},
      { path: 'album/:id', loadComponent: () => import('./pages/album-detail/album-detail').then(m => m.AlbumDetailComponent)},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
