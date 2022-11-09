import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { UseIsFetching } from '../is-fetching';
import { UseQuery } from '../query';
import { delayFetcher, flushPromises } from './test-utils';

describe('isFetching', () => {
  let useIsFetching: UseIsFetching;
  let useQuery: UseQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    useIsFetching = TestBed.inject(UseIsFetching);
    useQuery = TestBed.inject(UseQuery);
  });

  it('should be defined', async () => {
    expect(useIsFetching).toBeTruthy();
  });

  test('should properly return isFetching state', async () => {
    const isFetching = useIsFetching();

    const spy = subscribeSpyTo(isFetching);
    expect(spy.getLastValue()).toBe(0);

    subscribeSpyTo(useQuery(['key1'], delayFetcher(100)).result$);
    subscribeSpyTo(useQuery(['key2'], delayFetcher(100)).result$);

    await flushPromises();

    expect(spy.getLastValue()).toBe(2);

    await flushPromises(500);
    expect(spy.getLastValue()).toBe(0);
  });
});
