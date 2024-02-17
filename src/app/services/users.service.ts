import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { injectQuery, queryOptions } from '@ngneat/query';

export interface User {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  #query = injectQuery();
  #http = inject(HttpClient);

  getUserOptions = (userId: number) =>
    queryOptions({
      queryKey: ['users', userId] as const,
      queryFn: () => {
        return this.#http.get<User>(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
        );
      },
    });

  getUser(userId: number) {
    return this.#query(this.getUserOptions(userId));
  }
}
