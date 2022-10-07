import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

function DevtoolApp({ queryClient }: { queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export function renderDevtool({ queryClient }: { queryClient: QueryClient }) {
  const reactRootEle = document.createElement('div');
  document.body.appendChild(reactRootEle);

  const root = ReactDOM.createRoot(reactRootEle);
  root.render(<DevtoolApp queryClient={queryClient}></DevtoolApp>);
}
