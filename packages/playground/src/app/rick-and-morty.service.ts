import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClientService, UseQuery } from '@ngneat/query';
import {
  BehaviorSubject,
  delay,
  distinctUntilChanged,
  firstValueFrom,
  map,
  scan,
  tap,
} from 'rxjs';
import {
  Character,
  Episode,
  Episodes,
  Location,
} from './types/rick-morty.types';

const BASE_URL = 'https://rickandmortyapi.com/api';
const CHARACTER_API_URL = `${BASE_URL}/character`;

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private http = inject(HttpClient);
  private useQuery = inject(UseQuery);
  private queryClient = inject(QueryClientService);

  private prefetchedCharacterIds = new BehaviorSubject<number>(1);
  private prefetchedCharacterIds$ = this.prefetchedCharacterIds
    .asObservable()
    .pipe(
      scan((acc: Set<number>, curr: number) => acc.add(curr), new Set<number>())
    );

  getCharacter(id: number) {
    return this.useQuery(['character', id], () => this.getCharacterRaw(id));
  }

  prefetchCharacter(id: number) {
    return this.queryClient.prefetchQuery(
      ['character', id],
      () =>
        firstValueFrom(
          this.getCharacterRaw(id).pipe(
            tap((character) => this.prefetchedCharacterIds.next(character.id))
          )
        ),
      {
        staleTime: 1_000_000,
      }
    );
  }

  isCharacterPrefetched(id: number) {
    return this.prefetchedCharacterIds$.pipe(
      map((prefetchedCharacterIds) => prefetchedCharacterIds.has(id)),
      distinctUntilChanged()
    );
  }

  private getCharacterRaw(id: number) {
    return this.http
      .get<Character>(`${CHARACTER_API_URL}/${id}`)
      .pipe(delay(1000));
  }

  getCharacters() {
    return this.useQuery(['characters'], () =>
      this.http
        .get<{ results: Character[] }>(CHARACTER_API_URL)
        .pipe(map(({ results }) => results))
    );
  }

  getEpisodes() {
    return this.useQuery(['episodes'], () =>
      this.http.get<Episodes>(`${BASE_URL}/episode`)
    );
  }

  getEpisode(episodeId: string) {
    return this.useQuery(['episode', episodeId], () =>
      this.http.get<Episode>(`${BASE_URL}/episode/${episodeId}`)
    );
  }

  getLocation(locationId: string) {
    return this.useQuery(['location', locationId], () =>
      this.http.get<Location>(`${BASE_URL}/location/${locationId}`)
    );
  }
}
