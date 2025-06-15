import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state.service';

@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent implements OnInit, OnDestroy {
  appLogo = 'assets/logo-agendador-javanauta.png';
  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterStateService);

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
}
