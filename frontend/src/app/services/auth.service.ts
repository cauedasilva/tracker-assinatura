import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environment.prod';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/interfaces';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/sign-up`, data).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data.user);
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/sign-in`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data.user);
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/sign-out`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.currentUser.set(null);
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        localStorage.removeItem('token');
        this.currentUser.set(null);
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/users/me`).pipe(
      map(response => response.data),
      tap(user => this.setCurrentUser(user)),
      catchError(this.handleError)
    );
  }

  checkAuthStatus(): Observable<User | null> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.clearAuthData();
      return of(null);
    }

    return this.getCurrentUser().pipe(
      tap(user => this.setCurrentUser(user)),
      catchError(() => {
        this.clearAuthData();
        return of(null);
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
  }

  private clearAuthData(): void {
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message || errorMessage;
    }

    console.error('Auth Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}