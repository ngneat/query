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

export function ngQueryDevtools({ queryClient }: { queryClient: QueryClient }) {
  // is it safe to attach the react application to the child of body like this?
  // if it's cause any issue we can allow consumer application to override the
  // element that the query-devtool should mount on
  const reactRootEle = document.createElement('div');
  document.body.appendChild(reactRootEle);

  const root = ReactDOM.createRoot(reactRootEle);
  root.render(<DevtoolApp queryClient={queryClient}></DevtoolApp>);
  console.log('attached the devtool');
}
