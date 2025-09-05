import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-tasks',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

}
