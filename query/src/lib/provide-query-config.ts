import { InjectionToken, Provider } from '@angular/core';

import { QueryObject, QueryToken } from './query';
import { MutationObject, MutationToken } from './mutation';
import { IsMutatingObject, IsMutatingToken } from './is-mutating';
import { IsFetchingObject, IsFetchingToken } from './is-fetching';
import { InfiniteQueryObject, InfiniteQueryToken } from './infinite-query';

function providerBuilder<Kind>(
  token: InjectionToken<Kind>,
  valueOrFactory: Kind | (() => Kind),
): Provider {
  return {
    provide: token,
    useFactory:
      typeof valueOrFactory === 'function'
        ? valueOrFactory
        : () => valueOrFactory,
  };
}

/** @public */
export function provideQueryConfig(
  config: {
    query?: QueryObject | (() => QueryObject);
    mutation?: MutationObject | (() => MutationObject);
    isMutating?: IsMutatingObject | (() => IsMutatingObject);
    isFetching?: IsFetchingObject | (() => IsFetchingObject);
    infiniteQuery?: InfiniteQueryObject | (() => InfiniteQueryObject);
  },
): Provider {
  const providers: Provider = [];
  if (config.query) {
    providers.push(providerBuilder(QueryToken, config.query));
  }
  if (config.mutation) {
    providers.push(providerBuilder(MutationToken, config.mutation));
  }
  if (config.isMutating) {
    providers.push(providerBuilder(IsMutatingToken, config.isMutating));
  }
  if (config.isFetching) {
    providers.push(providerBuilder(IsFetchingToken, config.isFetching));
  }
  if (config.infiniteQuery) {
    providers.push(providerBuilder(InfiniteQueryToken, config.infiniteQuery));
  }
  return providers;
}
