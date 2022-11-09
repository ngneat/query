import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { UsePersistedQuery } from '../persisted-query';
import { flushPromises, persistedFetcher } from './test-utils';

describe('usePersistedQuery', () => {
  let usePersistedQuery: UsePersistedQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    usePersistedQuery = TestBed.inject(UsePersistedQuery);
  });

  it('should be defined', () => {
    expect(usePersistedQuery).toBeTruthy();
  });

  it('should have keepPreviousData option to be true', async () => {
    const fetch = usePersistedQuery(persistedFetcher);

    const query = fetch(['key1', 0]);
    expect(query.options.keepPreviousData).toBe(true);
  });

  it('should preserve old results while fetching again', async () => {
    const fetch = usePersistedQuery(persistedFetcher);
    const query = fetch(['key2', 0]);
    const spy = subscribeSpyTo(query.result$);
    await flushPromises();
    fetch(['key2', 5]);
    await flushPromises();
    expect(spy.getValuesLength()).toBe(4);
  });
});
