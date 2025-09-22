import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserResponse, UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);

  user = this.userService.getUser();
  form = this.formBuilder.group({
    nome: [{ value: this.user?.nome || '', disabled: true }],
    email: [{ value: this.user?.email || '', disabled: true }],
  });

}
