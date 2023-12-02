import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'query-dynamic-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss'],
})
export class DynamicPageComponent {
  usersService = inject(UsersService);
  userResultDef = this.usersService.getUser(
    +inject(ActivatedRoute).snapshot.queryParams['id'],
  );

  user = this.userResultDef.result;

  @Input()
  set id(userId: string) {
    this.userResultDef.updateOptions(this.usersService.getUserOptions(+userId));
  }
}
