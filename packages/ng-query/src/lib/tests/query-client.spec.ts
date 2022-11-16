import { TestBed } from '@angular/core/testing';
import { QueryClientService } from '../query-client';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QUERY_CLIENT_OPTIONS } from '../providers';

describe('Query Client', () => {
  let client: QueryCore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    client = TestBed.inject(QueryClientService);
  });

  it('should be defined', async () => {
    expect(client).toBeTruthy();
  });
});

describe('Query Client with default options', () => {
  let client: QueryCore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: QUERY_CLIENT_OPTIONS,
          useValue: {
            defaultOptions: {
              queries: {
                staleTime: 4444,
                enabled: true,
              },
            },
          },
        },
      ],
    });
    client = TestBed.inject(QueryClientService);
  });

  it('should be defined', async () => {
    expect(client).toBeTruthy();
  });

  it('should have queries options', async () => {
    expect(client.getDefaultOptions()).toMatchObject({
      queries: {
        staleTime: 4444,
        enabled: true,
      },
    });
  });
});
