import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient, QueryProvider } from '@ngneat/query';
import {
  BehaviorSubject,
  delay,
  distinctUntilChanged,
  firstValueFrom,
  map,
  scan,
  tap,
} from 'rxjs';

export interface Character {
  readonly id: number;
  readonly name: string;
  readonly image: string;
}

const CHARACTER_API_URL = 'https://rickandmortyapi.com/api/character';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private http = inject(HttpClient);
  private useQuery = inject(QueryProvider);
  private queryClient = inject(QueryClient);

  private prefetchedCharacterIds = new BehaviorSubject<number>(1);
  private prefetchedCharacterIds$ = this.prefetchedCharacterIds
    .asObservable()
    .pipe(
      scan((acc: Set<number>, curr: number) => acc.add(curr), new Set<number>())
    );

  getCharacters() {
    return this.useQuery(['characters'], () =>
      this.http
        .get<{ results: Character[] }>(CHARACTER_API_URL)
        .pipe(map(({ results }) => results))
    );
  }

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
}
