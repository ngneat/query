import { TestBed } from '@angular/core/testing';
import { QueryClientService } from '../query-client';
import { arrayPush } from '../entity-utils';

interface Item {
  id: string;
}

describe('entity utils', () => {
  it('should add entity to the query', () => {
    const { client } = setup();
    const item1: Item = { id: 'item-1' };
    const item2: Item = { id: 'item-2' };

    client.setQueryData(['item'], item1);
    client.setQueryData(['item'], arrayPush('item', item2));

    const items = client.getQueryData<Item[]>(['item']);

    expect(items?.length).toBe(2);
  });

  function setup() {
    TestBed.configureTestingModule({});
    const client = TestBed.inject(QueryClientService);
    return { client };
  }
});
