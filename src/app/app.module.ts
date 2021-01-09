import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HubComponent } from './hub/hub.component';
import { ProfileComponent } from './hub/profile/profile.component';
import { AuthComponent } from './auth/auth.component';
import { GameModeComponent } from './hub/game-mode/game-mode.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { ModalComponent } from './shared/modal/modal.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { SingleplayerComponent } from './game/singleplayer/singleplayer.component';
import { CardComponent } from './game/shared/card/card.component';
import { DeckComponent } from './game/shared/deck/deck.component';
import { PotComponent } from './game/shared/pot/pot.component';
import { GameManagerService } from './game/singleplayer/game-manager.service';
import { GameOverModalComponent } from './game/shared/game-over-modal/game-over-modal.component';
import { HeaderComponent } from './shared/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoadingDotsComponent } from './shared/loading-dots/loading-dots.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ModeComponent } from './hub/game-mode/mode/mode.component';
import { ComingsoonToastComponent } from './shared/comingsoon-toast/comingsoon-toast.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HubComponent,
    ProfileComponent,
    AuthComponent,
    GameModeComponent,
    ModalComponent,
    SingleplayerComponent,
    CardComponent,
    DeckComponent,
    PotComponent,
    GameOverModalComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoadingDotsComponent,
    ForgotPasswordComponent,
    ModeComponent,
    ComingsoonToastComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastNotificationsModule.forRoot({
      component: ComingsoonToastComponent,
      duration: 3000,
      type: 'info',
      position: 'bottom-center',
      preventDuplicates: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    GameManagerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
