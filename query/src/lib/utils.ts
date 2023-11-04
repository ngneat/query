import { Observable, Subject, firstValueFrom, takeUntil } from 'rxjs';

export function toPromise<T>({
  source,
  signal,
}: {
  source: Observable<T>;
  signal: AbortSignal;
}): Promise<T> {
  const cancel = new Subject<void>();

  signal.addEventListener('abort', () => {
    cancel.next();
    cancel.complete();
  });

  return firstValueFrom(source.pipe(takeUntil(cancel)));
}
