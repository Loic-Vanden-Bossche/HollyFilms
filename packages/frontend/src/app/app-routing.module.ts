import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { ShowcaseComponent } from './pages/showcase/showcase.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';
import { AuthGuardService as AuthGuard } from './auth/auth.guard';
import { AdminGuardService as AdminGuard } from './admin/admin.guard';
import { PlayerComponent } from './player/player.component';
import { AdminMediasComponent } from './admin/admin-medias/admin-medias.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        data: { title: 'HollyFilms' },
        component: ShowcaseComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Films' },
        canActivate: [AuthGuard],
      },
      {
        path: 'search',
        component: SearchResultsComponent,
        data: { title: 'Search' },
        canActivate: [AuthGuard],
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        data: { title: 'Panneau admin' },
        canActivate: [AuthGuard, AdminGuard],
        children: [
          {
            path: '',
            data: { animation: 'default' },
            component: AdminMediasComponent,
          },
          {
            path: 'medias',
            data: { animation: 'medias' },
            component: AdminMediasComponent,
          },
          {
            path: 'users',
            data: { animation: 'users' },
            component: AdminUsersComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'play/:mediaId',
    component: PlayerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'play/:mediaId/:seasonIndex/:episodeIndex',
    component: PlayerComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'not-found' },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
