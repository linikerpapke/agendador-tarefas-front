import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state.service';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, MatMenuModule],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent implements OnInit, OnDestroy {
  appLogo = 'assets/logo-agendador-javanauta.png';
  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterStateService);
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private route = inject(Router)

  ngOnInit(): void {
    this.inscricaoRota = this.routerService.rotaAtual$.subscribe(url => {
      this.rotaAtual = url;
    })
  }

  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  estaNaRotaRegister(): boolean {
    return this.rotaAtual === '/register'
  }

  estaNaRotaLogin(): boolean {
    return this.rotaAtual === '/login'
  }

  get estaLogado(): boolean {
    return this.authService.isLoggedIn()
  }

  pegarInicialUsuario(): string {

    const user = this.userService.getUser();

    if (user && user.nome) {
      return user.nome.charAt(0).toUpperCase();
    }

    return '?'
  }

  logout(): void {
    this.authService.logout();
    this.route.navigate(['/login'])
  }

}
