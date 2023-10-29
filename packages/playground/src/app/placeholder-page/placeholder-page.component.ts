import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlaceholderDataAsValueComponent } from './placeholder-data-as-value.component';
import { PlaceholderDataFromCacheComponent } from './placeholder-data-from-cache.component';

@Component({
  selector: 'ng-query-placeholder-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgForOf,
    RouterModule,
    PlaceholderDataAsValueComponent,
    PlaceholderDataFromCacheComponent,
  ],
  template: `<div>
    <h1 class="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black">
      Placeholder Query Data
    </h1>
    <div class="h-4"></div>
    <div class="h-px bg-gray-500 opacity-20"></div>
    <div class="h-4"></div>
    <div class="">
      <a
        href="/placeholder-query-data#what-is-placeholder-data"
        class="text-black"
        ><h2 id="what-is-placeholder-data" class="inline-block text-xl">
          What is placeholder data?
        </h2></a
      >
      <p>
        Placeholder data allows a query to behave as if it already has data,
        similar to the
        <code
          class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1"
          >initialData</code
        >
        option, but <strong>the data is not persisted to the cache</strong>.
        This comes in handy for situations where you have enough partial (or
        fake) data to render the query successfully while the actual data is
        fetched in the background.
      </p>
      <blockquote>
        <p>
          Example: An individual blog post query could pull "preview" data from
          a parent list of blog posts that only include title and a small
          snippet of the post body. You would not want to persist this partial
          data to the query result of the individual query, but it is useful for
          showing the content layout as quickly as possible while the actual
          query finishes to fetch the entire object.
        </p>
      </blockquote>
      <p>
        There are a few ways to supply placeholder data for a query to the cache
        before you need it:
      </p>
      <ul>
        <li>
          Declaratively:
          <ul>
            <li>
              Provide placeholderData to a query to prepopulate its cache if
              empty
            </li>
          </ul>
        </li>
        <li>
          Imperatively:
          <ul>
            <li>
              <a routerLink="/prefetching" class="text-black"
                >Prefetch or fetch the data using queryClient and the
                placeholderData option</a
              >
            </li>
          </ul>
        </li>
      </ul>
      <a
        href="/placeholder-query-data#placeholder-data-as-a-value"
        class="text-black"
        ><h2 id="placeholder-data-as-a-value" class="inline-block text-xl mt-6">
          Placeholder Data as a Value
        </h2>
      </a>
      <ng-query-placeholder-data-as-value
        #exampleOne
      ></ng-query-placeholder-data-as-value>
      <a
        href="/placeholder-query-data#placeholder-data-from-cache"
        class="text-black"
        ><h2 id="placeholder-data-from-cache" class="inline-block text-xl mt-6">
          Placeholder Data from Cache
        </h2>
      </a>
      <p>
        In some circumstances, you may be able to provide the placeholder data
        for a query from the cached result of another. A good example of this
        would be searching the cached data from a blog post list query for a
        preview version of the post, then using that as the placeholder data for
        your individual post query:
      </p>
      <ng-query-placeholder-data-from-cache></ng-query-placeholder-data-from-cache>
    </div>
  </div>`,
  styles: [
    `
      blockquote {
        margin-top: 1.3333333em;
        margin-bottom: 1.3333333em;
        padding-left: 1.1111111em;
        font-weight: 500;
        font-style: italic;
        border-left-style: solid;
        border-left-width: 0.25rem;
        border-left-color: var(--bs-gray-500);
      }
    `,
  ],
})
export class PlaceholderPageComponent {}
