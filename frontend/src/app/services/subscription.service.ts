import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
import { Subscription, ApiResponse, SubscriptionStats } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  subscriptions = signal<Subscription[]>([]);
  loading = signal<boolean>(false);

  clear(): void {
    this.subscriptions.set([]);
  }

  getSubscriptions(): Observable<Subscription[]> {
    this.loading.set(true);

    return this.http
      .get<ApiResponse<Subscription[]>>(`${this.apiUrl}/subscriptions/me`)
      .pipe(
        map(res => res.data || []),
        tap(subs => {
          this.subscriptions.set(subs);
          this.loading.set(false);
        }),
        catchError(err => {
          this.loading.set(false);
          return this.handleError(err);
        })
      );
  }

  getUpcomingRenewalsFromApi(): Observable<Subscription[]> {
    return this.http.get<ApiResponse<Subscription[]>>(
      `${this.apiUrl}/subscriptions/upcoming-renewals`
    ).pipe(
      map(response => response.data || []),
      catchError(err => this.handleError(err))
    );
  }

  getSubscription(id: string): Observable<Subscription> {
    return this.http.get<ApiResponse<Subscription>>(
      `${this.apiUrl}/subscriptions/${id}`
    ).pipe(
      map(response => response.data!),
      catchError(this.handleError)
    );
  }

  createSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.post<ApiResponse<Subscription>>(
      `${this.apiUrl}/subscriptions`,
      subscription
    ).pipe(
      map(response => response.data!),
      tap(newSub => {
        const current = this.subscriptions();
        this.subscriptions.set([...current, newSub]);
      }),
      catchError(this.handleError)
    );
  }

  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<ApiResponse<Subscription>>(
      `${this.apiUrl}/subscriptions/${id}`,
      subscription
    ).pipe(
      map(response => response.data!),
      tap(updatedSub => {
        const current = this.subscriptions();
        const index = current.findIndex(s => s._id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedSub;
          this.subscriptions.set(updated);
        }
      }),
      catchError(this.handleError)
    );
  }

  cancelSubscription(id: string): Observable<Subscription> {
    return this.http.put<ApiResponse<Subscription>>(
      `${this.apiUrl}/subscriptions/${id}/cancel`,
      {}
    ).pipe(
      map(response => response.data!),
      tap(canceledSub => {
        const current = this.subscriptions();
        const index = current.findIndex(s => s._id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = canceledSub;
          this.subscriptions.set(updated);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteSubscription(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/subscriptions/${id}`
    ).pipe(
      tap(() => {
        const current = this.subscriptions();
        this.subscriptions.set(current.filter(s => s._id !== id));
      }),
      catchError(this.handleError)
    );
  }

  calculateStats(subscriptions: Subscription[]): SubscriptionStats {
    const stats: SubscriptionStats = {
      total: subscriptions.length,
      active: 0,
      expired: 0,
      canceled: 0,
      monthlyTotal: 0,
      yearlyTotal: 0,
      byCategory: {}
    };

    subscriptions.forEach(sub => {
      if (sub.status === 'active') stats.active++;
      else if (sub.status === 'expired') stats.expired++;
      else if (sub.status === 'canceled') stats.canceled++;

      if (!stats.byCategory[sub.category]) {
        stats.byCategory[sub.category] = 0;
      }
      stats.byCategory[sub.category]++;

      if (sub.status === 'active') {
        const monthlyPrice = this.convertToMonthly(sub.price, sub.frequency);
        stats.monthlyTotal += monthlyPrice;
        stats.yearlyTotal += monthlyPrice * 12;
      }
    });

    return stats;
  }

  private convertToMonthly(price: number, frequency: string): number {
    switch (frequency) {
      case 'daily':
        return price * 30;
      case 'weekly':
        return price * 4;
      case 'monthly':
        return price;
      case 'yearly':
        return price / 12;
      default:
        return price;
    }
  }

  getByStatus(status: 'active' | 'expired' | 'canceled'): Subscription[] {
    return this.subscriptions().filter(sub => sub.status === status);
  }

  getUpcomingRenewals(): Subscription[] {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return this.subscriptions().filter(sub => {
      if (sub.status !== 'active' || !sub.renewalDate) return false;
      const renewalDate = new Date(sub.renewalDate);
      return renewalDate >= now && renewalDate <= weekFromNow;
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message || errorMessage;
    }

    console.error('Subscription Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  reset(): void {
    this.subscriptions.set([]);
    this.loading.set(false);
  }
}