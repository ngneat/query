import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { UseMutation, MutationProvider } from '../mutation';
import { errorMutator, flushPromises, successMutator } from './test-utils';

describe('useMutation', () => {
  let useMutation: UseMutation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    useMutation = TestBed.inject(MutationProvider);
  });

  it('should be defined', async () => {
    expect(useMutation).toBeTruthy();
  });

  it('should be in idle state initially', () => {
    const mutation = useMutation((params) => successMutator(params));

    expect(mutation.getCurrentResult()).toMatchObject({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  });

  it('should change state after invoking mutate', async () => {
    const mock = 'Mock data';
    const mutation = useMutation((params: string) => successMutator(params));

    mutation.mutate(mock);

    const observerSpy = subscribeSpyTo(mutation.result$);
    await flushPromises();
    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      isIdle: false,
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
    });
  });

  it('should return error when request fails', async () => {
    const mutation = useMutation(errorMutator);

    await expect(mutation.mutate({})).rejects.toThrowError('some error');

    const observerSpy = subscribeSpyTo(mutation.result$);
    await flushPromises();
    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      isIdle: false,
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: undefined,
      error: Error('some error'),
    });
  });

  it('should return data when request succeeds', async () => {
    const mock = 'Mock data';
    const mutation = useMutation((params: string) => successMutator(params));

    mutation.mutate(mock);

    const observerSpy = subscribeSpyTo(mutation.result$);
    await flushPromises(400);
    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      isIdle: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: 'Mock data',
      error: null,
    });
  });

  it('should reset state after invoking mutation.reset', async () => {
    const mutation = useMutation((params: string) => successMutator(params));

    mutation.mutate('');

    const observerSpy = subscribeSpyTo(mutation.result$);
    await flushPromises(400);
    mutation.reset();
    await flushPromises(10);
    const result = observerSpy.getLastValue();

    expect(result).toMatchObject({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
    });
  });
});
