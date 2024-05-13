import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../model/User';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  user: User = new User();

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.user.email, this.user.password).subscribe(
      (authenticated) => {
        if (authenticated) {

          this.router.navigate(['/']);
          console.log('Login successful');
        } else {
          console.error('Login failed: Invalid credentials');

        }
      },
      (error) => {
        console.error('Login failed:', error);

      }
    );
  }

}
