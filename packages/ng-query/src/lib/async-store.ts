import { BehaviorSubject, MonoTypeOperatorFunction, pipe, tap } from 'rxjs';

class MutationAsyncState<Response = unknown, Error = unknown> {
  data: Response | null = null;
  isError = false;
  isLoading = false;
  isSuccess = false;
  error: Error | null = null;

  constructor(result: Partial<MutationAsyncState> = {}) {
    Object.assign(this, result);
  }
}

export function createAsyncStore<Response, Error = unknown>() {
  const store = new BehaviorSubject<MutationAsyncState<Response, Error>>(
    new MutationAsyncState()
  );

  function update(data: Response | ((res: Response) => Response)) {
    let resolved = data;

    if (typeof data === 'function') {
      resolved = (data as any)(store.getValue().data);
    }

    store.next(
      new MutationAsyncState({
        data: resolved,
        isSuccess: true,
      })
    );
  }

  return {
    value$: store.asObservable(),
    getValue: store.getValue(),
    track<T extends Response>(): MonoTypeOperatorFunction<T> {
      return pipe(
        tap({
          next(data) {
            update(data);
          },
          subscribe() {
            store.next(
              new MutationAsyncState({
                isLoading: true,
              })
            );
          },
          error(err) {
            store.next(
              new MutationAsyncState({
                error: err,
                isError: true,
              })
            );
          },
        })
      );
    },
  };
}
