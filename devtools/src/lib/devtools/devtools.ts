import {
  onlineManager as QueryCoreOnlineManager,
  QueryClient,
} from '@tanstack/query-core';
import { DestroyRef } from '@angular/core';
import {
  TanstackQueryDevtools,
  TanstackQueryDevtoolsConfig,
} from '@tanstack/query-devtools';

export function queryDevtools({
  queryClient,
  destroyRef,
  queryFlavor = '@ngneat/query',
  version = '5',
  onlineManager = QueryCoreOnlineManager,
  initialIsOpen = false,
  position = 'bottom',
  buttonPosition = 'bottom-right',
}: {
  queryClient: QueryClient;
  destroyRef: DestroyRef;
} & Partial<Omit<TanstackQueryDevtoolsConfig, 'client'>>) {
  const devtools: TanstackQueryDevtools = new TanstackQueryDevtools({
    client: queryClient,
    queryFlavor,
    version,
    onlineManager,
    initialIsOpen,
    position,
    buttonPosition,
  });

  destroyRef.onDestroy(() => devtools.unmount());

  devtools.mount(document.body);
}
