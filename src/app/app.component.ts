import { Component } from '@angular/core';
    import { TeleprompterComponent } from './teleprompter/teleprompter.component';

    @Component({
      selector: 'app-root',
      template: '<app-teleprompter></app-teleprompter>',
      styleUrls: ['./app.component.css'],
      standalone: true,
      imports: [TeleprompterComponent]
    })
    export class AppComponent {
    }
