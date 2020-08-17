import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { GardenComponent } from './game/shared/garden/garden.component';
import { DeckComponent } from './game/shared/deck/deck.component';
import { PotComponent } from './game/shared/pot/pot.component';
import { GameManagerService } from './game/singleplayer/game-manager.service';
import { GameOverModalComponent } from './game/shared/game-over-modal/game-over-modal.component';

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
    GardenComponent,
    DeckComponent,
    PotComponent,
    GameOverModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
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
