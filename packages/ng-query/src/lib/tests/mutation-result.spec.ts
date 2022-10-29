import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, delay, throwError } from 'rxjs';
import { useMutationResult } from '../mutation-result';

describe('use mutation result', () => {
  it('should be defined', async () => {
    expect(useMutationResult).toBeTruthy();
  });

  it('should have null values initially', () => {
    const mutation = useMutationResult();
    const observerSpy = subscribeSpyTo(mutation.result$);
    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      data: null,
      isError: false,
      isLoading: false,
      isSuccess: false,
      error: null,
    });
  });

  it('should emit loading state when track operator is subscribed', () => {
    const mutation = useMutationResult();
    const sub = of('data').pipe(delay(1000), mutation.track()).subscribe();
    const observerSpy = subscribeSpyTo(mutation.result$);

    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      data: null,
      isError: false,
      isLoading: true,
      isSuccess: false,
      error: null,
    });
    sub.unsubscribe();
  });

  it('should emit data state when track operator gets value', () => {
    const mutation = useMutationResult();
    const sub = of('data').pipe(mutation.track()).subscribe();
    const observerSpy = subscribeSpyTo(mutation.result$);

    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      data: 'data',
      isError: false,
      isLoading: false,
      isSuccess: true,
      error: null,
    });
    sub.unsubscribe();
  });

  it('should throw error when track operator gets error', () => {
    const mutation = useMutationResult();
    const sub = throwError(() => 'error')
      .pipe(mutation.track())
      .subscribe();
    const observerSpy = subscribeSpyTo(mutation.result$);

    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      data: null,
      isError: true,
      isLoading: false,
      isSuccess: false,
      error: 'error',
    });
    sub.unsubscribe();
  });
});
