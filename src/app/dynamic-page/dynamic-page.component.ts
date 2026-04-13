import { Component, inject, input } from '@angular/core';
import { User, UsersService } from '../services/users.service';
import { RouterModule } from '@angular/router';
import { createPendingObserverResult } from '@ngneat/query';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
    selector: 'query-dynamic-page',
    imports: [RouterModule],
    templateUrl: './dynamic-page.component.html',
    styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent {
  id = input.required<string>();
  usersService = inject(UsersService);

  user = derivedAsync(() => this.usersService.getUser(+this.id()).result$, {
    initialValue: createPendingObserverResult<User>(),
  });

  // userResultDef = this.usersService.getUser(
  //   +inject(ActivatedRoute).snapshot.queryParams['id'],
  // );

  // user = this.userResultDef.result;

  // @Input()
  // set id(userId: string) {
  // this.userResultDef.updateOptions(this.usersService.getUserOptions(+userId));
  // }
}
