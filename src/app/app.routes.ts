import { Route } from '@angular/router';
import { TodosPageComponent } from './basic-page/todos-page.component';
import { PostsPageComponent } from './infinite-scroll-page/posts-page.component';
import { PaginationPageComponent } from './pagination-page/pagination-page.component';

export const appRoutes: Route[] = [
  {
    path: 'basic',
    component: TodosPageComponent,
  },
  {
    path: 'infinite-scroll',
    component: PostsPageComponent,
  },
  {
    path: 'pagination',
    component: PaginationPageComponent,
  },
];
