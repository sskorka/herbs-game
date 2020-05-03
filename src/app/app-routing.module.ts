import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HubComponent } from './hub/hub.component';
import { AuthComponent } from './auth/auth.component';
import { SingleplayerComponent } from './game/singleplayer/singleplayer.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/hub', pathMatch: 'full'},
  { path: 'auth', component: AuthComponent },
  { path: 'hub', canActivate: [ AuthGuard ], component: HubComponent },
  { path: 'solitaire', canActivate: [ AuthGuard ], component: SingleplayerComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
