import { Route } from '@angular/router';
import { RickMortyLayoutComponent } from './rick-morty-layout.component';

export const routes: Route[] = [
  {
    path: '',
    component: RickMortyLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./homepage.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'episodes',
        loadComponent: () =>
          import('./episodes.component').then((m) => m.EpisodesComponent),
      },
      {
        path: 'episodes/:episodeId',
        loadComponent: () =>
          import('./episode.component').then((m) => m.EpisodeComponent),
      },
      {
        path: 'characters',
        loadComponent: () =>
          import('./characters.component').then((m) => m.CharactersComponent),
      },
      {
        path: 'characters/:characterId',
        loadComponent: () =>
          import('./character.component').then((m) => m.CharacterComponent),
      },
    ],
  },
];
