import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { FormsModule } from '@angular/forms';
    import { AppComponent } from './app.component';
    import { TeleprompterComponent } from './teleprompter/teleprompter.component';

    @NgModule({
      declarations: [],
      imports: [
        BrowserModule,
        FormsModule,
        AppComponent,
        TeleprompterComponent
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
