import { Component } from '@angular/core';
import { User } from '../../model/User';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  newUser: User = new User();
  confirmPassword: string = '';
  checkboxChecked: boolean = false;
  emailExistsError: boolean = false;

  constructor(private authService: AuthService, private router: Router ,  private http: HttpClient) {}
  submitForm() {
    if (this.newUser.password === this.confirmPassword) {
      console.log('Passwords match!');
    } else {
      console.log('Passwords do not match!');
    }
  }
  register(): void {
    if (this.newUser.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    if (!this.checkboxChecked) {
      console.error('Please accept the terms and conditions');
      return;
    }
    this.http.get<any[]>('http://localhost:3000/users')
      .subscribe(
        (users) => {
          if (users.find(user => user.email === this.newUser.email)) {
            console.error('Email already exists. Please use another email.');
            this.emailExistsError = true;
          } else {
            this.emailExistsError = false;
            this.authService.register(this.newUser).subscribe(
              (response) => {
                this.router.navigate(['/']);
                console.log('Registration successful');
              },
              (error) => {
                console.error('Registration failed:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Failed to fetch users:', error);
        }
      );
  }
}
