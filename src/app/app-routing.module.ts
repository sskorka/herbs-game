import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HubComponent } from './hub/hub.component';
import { SingleplayerComponent } from './game/singleplayer/singleplayer.component';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: AppComponent},
  { path: 'hub', canActivate: [ AuthGuard ], component: HubComponent },
  { path: 'solitaire', canActivate: [ AuthGuard ], component: SingleplayerComponent },
  { path: 'recovery', component: ForgotPasswordComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
