import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient, QueryProvider } from '@ngneat/query';
import { delay, firstValueFrom, map } from 'rxjs';

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
      () => firstValueFrom(this.getCharacterRaw(id)),

      {
        staleTime: 1_000_000,
      }
    );
  }

  private getCharacterRaw(id: number) {
    return this.http
      .get<Character>(`${CHARACTER_API_URL}/${id}`)
      .pipe(delay(1000));
  }
}
