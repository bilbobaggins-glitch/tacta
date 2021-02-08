import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicial', pathMatch: 'full' },
  // { path: '', redirectTo: 'blank', pathMatch: 'full' },
  // { path: '', redirectTo: 'adicionarcontato', pathMatch: 'full' },
  // { path: 'blank', loadChildren: './pages/blank/blank.module#BlankPageModule' },
  { path: 'inicial', loadChildren: './pages/inicial/inicial.module#InicialPageModule' },
  { path: 'detalhescontato', loadChildren: './pages/detalhescontato/detalhescontato.module#DetalhescontatoPageModule' },
  { path: 'detalhescontato/:id', loadChildren: './pages/detalhescontato/detalhescontato.module#DetalhescontatoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
