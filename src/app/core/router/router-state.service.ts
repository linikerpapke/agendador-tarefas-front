import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterStateService {

  private rotaAtualSubject$ = new BehaviorSubject<string>('');
  public readonly rotaAtual$ = this.rotaAtualSubject$.asObservable();


  constructor(private router: Router) {

    this.rotaAtualSubject$.next(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((evento: NavigationEnd) => {
        this.rotaAtualSubject$.next(evento.url)
      })
  }
}
