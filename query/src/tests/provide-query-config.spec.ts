import { TestBed } from '@angular/core/testing';
import { provideQueryConfig } from '../lib/provide-query-config';
import { injectQuery, QueryObject } from '../lib/query';
import { injectMutation, MutationObject } from '../lib/mutation';
import { of } from 'rxjs';
import { injectIsMutating, IsMutatingObject } from '../lib/is-mutating';
import { injectIsFetching, IsFetchingObject } from '../lib/is-fetching';
import {
  InfiniteQueryObject,
  injectInfiniteQuery,
} from '../lib/infinite-query';

describe('Provide Query Config', () => {
  describe('Custom Query', () => {
    const queryMock: QueryObject = {
      use: jest.fn(() => {}),
    };

    it('should use custom query', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ query: queryMock })],
      });
      const query = TestBed.runInInjectionContext(() => injectQuery());
      const queryOptions = {
        queryKey: ['test1', 'test3'],
        queryFn: () => 'test2',
      };
      query(queryOptions);

      expect(queryMock.use).lastCalledWith(queryOptions);
    });

    it('should use custom query provided from function', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ query: () => queryMock })],
      });
      const query = TestBed.runInInjectionContext(() => injectQuery());
      const queryOptions = {
        queryKey: ['test1', 'test2'],
        queryFn: () => 'test3',
      };
      query(queryOptions);

      expect(queryMock.use).lastCalledWith(queryOptions);
    });
  });

  describe('Custom Mutation', () => {
    const mutationMock: MutationObject = {
      use: jest.fn(() => {}) as any,
    };

    it('should use custom mutation', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ mutation: mutationMock })],
      });
      const mutation = TestBed.runInInjectionContext(() => injectMutation());
      const mutationOptions = {
        onSuccess: () => ['test1', 'test3'],
        mutationFn: () => of('test2'),
      };
      mutation(mutationOptions);

      expect(mutationMock.use).lastCalledWith(mutationOptions);
    });

    it('should use custom mutation provided from function', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ mutation: () => mutationMock })],
      });
      const mutation = TestBed.runInInjectionContext(() => injectMutation());
      const mutationOptions = {
        onSuccess: () => ['test1', 'test2'],
        mutationFn: () => of('test3'),
      };
      mutation(mutationOptions);

      expect(mutationMock.use).lastCalledWith(mutationOptions);
    });
  });

  describe('Custom IsMutating', () => {
    const isMutatingMock: IsMutatingObject = {
      use: jest.fn(() => {}) as any,
    };

    it('should use custom isMutating', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ isMutating: isMutatingMock })],
      });
      const isMutating = TestBed.runInInjectionContext(() =>
        injectIsMutating(),
      );
      const isMutatingOptions = {
        exact: true,
        predicate: () => false,
      };
      isMutating(isMutatingOptions);

      expect(isMutatingMock.use).lastCalledWith(isMutatingOptions);
    });

    it('should use custom isMutating provided from function', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ isMutating: () => isMutatingMock })],
      });
      const isMutating = TestBed.runInInjectionContext(() =>
        injectIsMutating(),
      );
      const isMutatingOptions = {
        exact: false,
        predicate: () => true,
      };
      isMutating(isMutatingOptions);

      expect(isMutatingMock.use).lastCalledWith(isMutatingOptions);
    });
  });

  describe('Custom IsFetching', () => {
    const isFetchingMock: IsFetchingObject = {
      use: jest.fn(() => {}) as any,
    };

    it('should use custom isFetching', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ isFetching: isFetchingMock })],
      });
      const isFetching = TestBed.runInInjectionContext(() =>
        injectIsFetching(),
      );
      const isFetchingOptions = {
        exact: true,
        predicate: () => false,
      };
      isFetching(isFetchingOptions);

      expect(isFetchingMock.use).lastCalledWith(isFetchingOptions);
    });

    it('should use custom isFetching provided from function', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ isFetching: () => isFetchingMock })],
      });
      const isFetching = TestBed.runInInjectionContext(() =>
        injectIsFetching(),
      );
      const isFetchingOptions = {
        exact: false,
        predicate: () => true,
      };
      isFetching(isFetchingOptions);

      expect(isFetchingMock.use).lastCalledWith(isFetchingOptions);
    });
  });

  describe('Custom InfiniteQuery', () => {
    const infiniteQueryMock: InfiniteQueryObject = {
      use: jest.fn(() => {}) as any,
    };

    it('should use custom isFetching', () => {
      TestBed.configureTestingModule({
        providers: [provideQueryConfig({ infiniteQuery: infiniteQueryMock })],
      });
      const infiniteQuery = TestBed.runInInjectionContext(() =>
        injectInfiniteQuery(),
      );
      const infiniteQueryOptions = {
        queryKey: ['test1', 'test2'],
        queryFn: () => 'test3',
        getNextPageParam: () => 'test4',
        initialPageParam: 'test5',
      };
      infiniteQuery(infiniteQueryOptions);

      expect(infiniteQueryMock.use).lastCalledWith(infiniteQueryOptions);
    });

    it('should use custom infiniteQuery provided from function', () => {
      TestBed.configureTestingModule({
        providers: [
          provideQueryConfig({ infiniteQuery: () => infiniteQueryMock }),
        ],
      });
      const infiniteQuery = TestBed.runInInjectionContext(() =>
        injectInfiniteQuery(),
      );
      const infiniteQueryOptions = {
        queryKey: ['test1', 'test3'],
        queryFn: () => 'test2',
        getNextPageParam: () => 'test5',
        initialPageParam: 'test4',
      };
      infiniteQuery(infiniteQueryOptions);

      expect(infiniteQueryMock.use).lastCalledWith(infiniteQueryOptions);
    });
  });
});
