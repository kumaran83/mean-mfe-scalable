// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductsComponent } from './products/products.component';

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload'
};

function loadMFE(url: string) {
  return loadRemoteModule({
    type: 'module',
    remoteEntry: `${url}/remoteEntry.js`,
    exposedModule: './Module'
  })
    .then(m => m.MfeModule)
    .catch(
      () => import('./error-page/error-page.module').then(m => m.ErrorPageModule)
    );
}

const routes: Routes = [

  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'home',
    component: ProductsComponent
  },
  {
    path: 'user-management',
    loadChildren: () => loadMFE(environment.userMangURL)
  },
  {
    path: '**',
    loadChildren: () => import('./error-page/error-page.module').then(m => m.ErrorPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
