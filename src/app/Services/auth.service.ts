import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , of } from 'rxjs';
import { User } from '../model/User';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private generateUniqueId(): number {
    return new Date().getTime();
  }

  register(user: User): Observable<boolean> {
    const id = this.generateUniqueId();
    user.id = id;
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      switchMap(registeredUser => {
        return this.login(registeredUser.email, registeredUser.password);
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;
        } else {
          return false;
        }
      })
    );
  }
 
  getUserId(): Observable<number | null> {
    return this.getLoggedInUser().pipe(
      map(user => {
        return user && user.id ? user.id : null;
      })
    );
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getLoggedInUser(): Observable<User | null> {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user: User = JSON.parse(userStr);
      return of(user);
    } else {
      return of(null);
    }
  }


  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
