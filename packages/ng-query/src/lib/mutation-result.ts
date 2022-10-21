import { BehaviorSubject, MonoTypeOperatorFunction, pipe, tap } from 'rxjs';

class MutationResult<Response = unknown, Error = unknown> {
  data: Response | null = null;
  isError = false;
  isLoading = false;
  isSuccess = false;
  error: Error | null = null;

  constructor(result: Partial<MutationResult> = {}) {
    Object.assign(this, result);
  }
}

export function useMutationResult<Response, Error = unknown>(
  options: Partial<MutationResult> = {}
) {
  const store = new BehaviorSubject<MutationResult<Response, Error>>(
    new MutationResult(options)
  );

  function update(data: Response | ((res: Response) => Response)) {
    let resolved = data;

    if (typeof data === 'function') {
      resolved = (data as any)(store.getValue().data);
    }

    store.next(
      new MutationResult({
        data: resolved,
        isSuccess: true,
      })
    );
  }

  return {
    result$: store.asObservable(),
    track<T extends Response>(): MonoTypeOperatorFunction<T> {
      return pipe(
        tap({
          next(data) {
            update(data);
          },
          subscribe() {
            store.next(
              new MutationResult({
                isLoading: true,
              })
            );
          },
          error(err) {
            store.next(
              new MutationResult({
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
