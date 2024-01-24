import { Injectable } from '@angular/core';

// just for simulating a simple service that could be
// injected during configuration
@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifyError(error: Error) {
    console.log(error);
  }
}
