import { Component, inject, input } from '@angular/core';
import { User, UsersService } from '../services/users.service';
import { RouterModule } from '@angular/router';
import { computedAsync } from 'ngxtension/computed-async';
import { createPendingObserverResult } from '@ngneat/query';

@Component({
  selector: 'query-dynamic-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss'],
})
export class DynamicPageComponent {
  id = input.required<string>();
  usersService = inject(UsersService);

  user = computedAsync(() => this.usersService.getUser(+this.id()).result$, {
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
