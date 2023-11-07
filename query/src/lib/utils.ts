import { Observable, Subject, firstValueFrom, takeUntil } from 'rxjs';

export function toPromise<T>({
  source,
  signal,
}: {
  source: Observable<T>;
  signal?: AbortSignal;
}): Promise<T> {
  const cancel = new Subject<void>();

  if (signal) {
    signal.addEventListener('abort', () => {
      cancel.next();
      cancel.complete();
    });
  }

  return firstValueFrom(source.pipe(signal ? takeUntil(cancel) : (s) => s));
}
