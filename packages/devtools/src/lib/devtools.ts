import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { QueryClient } from '@tanstack/query-core';

export function ngQueryDevtools({ queryClient }: { queryClient: QueryClient }) {
  const reactRootEle = document.createElement('div');
  reactRootEle.setAttribute('id', 'query-devtools');

  document.body.appendChild(reactRootEle);

  const root = createRoot(reactRootEle);
  const element = createElement(
    QueryClientProvider,
    { client: queryClient as any },
    createElement(ReactQueryDevtools, { initialIsOpen: false })
  );

  root.render(element);
}
