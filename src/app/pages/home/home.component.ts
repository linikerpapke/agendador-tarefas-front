import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  imgHero = 'assets/imagem-hero.svg'
}
