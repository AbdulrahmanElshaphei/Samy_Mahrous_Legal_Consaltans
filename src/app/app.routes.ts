import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guard/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { authGuard2 } from './shared/guard/auth.guard';
import { LoginComponent } from './core/pages/login/login.component';
import { ForgetPasswordComponent } from './core/pages/forget-password/forget-password.component';
import { TemplatesComponent } from './pages/templates/templates.component';

import { ContractEditorComponent } from './pages/contract-editor/contract-editor.component';
import { Articale1Component } from './pages/articale-1/articale-1.component';
import { VerifyComponent } from './core/pages/verify/verify.component';
import { SavedContractsComponent } from './pages/saved-contracts/saved-contracts.component';
import { Articale2Component } from './pages/articale-2/articale-2.component';
import { Articale3Component } from './pages/articale-3/articale-3.component';
import { Articale4Component } from './pages/articale-4/articale-4.component';
import { Articale5Component } from './pages/articale-5/articale-5.component';
import { Articale6Component } from './pages/articale-6/articale-6.component';
import { Articale7Component } from './pages/articale-7/articale-7.component';
import { Articale8Component } from './pages/articale-8/articale-8.component';
import { Articale9Component } from './pages/articale-9/articale-9.component';

export const routes: Routes = [
    { path: '', redirectTo: "home", pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: "notFound", component: NotFoundComponent },
    { path: "templates", component: TemplatesComponent },
    { path: "articale-1", component: Articale1Component },
    { path: "articale-2", component: Articale2Component},
    { path: "articale-3", component: Articale3Component},
    { path: "articale-4", component: Articale4Component},
    { path: "articale-5", component: Articale5Component},
    { path: "articale-6", component: Articale6Component},
    { path: "articale-7", component: Articale7Component},
    { path: "articale-8", component: Articale8Component},
    { path: "articale-9", component: Articale9Component},
    { path: 'contract-editor', component: ContractEditorComponent },
    { path: "savedContracts", component: SavedContractsComponent },
    { path: "register", component: RegisterComponent },
    { path: "verify", component: VerifyComponent},
    { path: "login", component: LoginComponent  },
    { path: "forgetpass", component: ForgetPasswordComponent},


    { path: "**", component: NotFoundComponent },
];
