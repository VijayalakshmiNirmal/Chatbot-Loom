import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatAiComponent } from './chat-ai/chat-ai.component';
import { IntroComponent } from './intro/intro.component';
import { ScoreComponent } from './score/score.component';
import { FormsModule } from '@angular/forms';
import { WritingComponent } from './writing/writing.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { PopupWindowComponent } from './popup-window/popup-window.component';
import { HeaderComponent } from './header/header.component';
// AIzaSyC_dvpk6qb6BGhEC0FukwCPIkKY0eJoxJc
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatAiComponent,
    IntroComponent,
    ScoreComponent,
    WritingComponent,
    PopupWindowComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    HttpClientModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
