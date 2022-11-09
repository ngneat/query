import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { UseIsMutating } from '../is-mutating';
import { UseMutation, MutationService } from '../mutation';
import { flushPromises, successMutator } from './test-utils';
import { delay } from 'rxjs';

describe('isMutating', () => {
  let useIsMutating: UseIsMutating;
  let useMutation: MutationService['use'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    useIsMutating = TestBed.inject(UseIsMutating);
    useMutation = TestBed.inject(UseMutation);
  });

  it('should be defined', async () => {
    expect(useIsMutating).toBeTruthy();
  });

  test('should properly return isMutating state', async () => {
    const mutation = useMutation((params) =>
      successMutator(params).pipe(delay(100))
    );
    const mutation2 = useMutation((params) =>
      successMutator(params).pipe(delay(100))
    );
    const isMutating = useIsMutating();

    const spy = subscribeSpyTo(isMutating);
    expect(spy.getLastValue()).toBe(0);

    mutation.mutate('data');
    mutation2.mutate('data');

    await flushPromises();
    expect(spy.getLastValue()).toBe(2);

    await flushPromises(200);
    expect(spy.getLastValue()).toBe(0);
  });
});
