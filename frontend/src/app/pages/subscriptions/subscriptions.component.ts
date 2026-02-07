import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, SubscriptionStats } from '../../models/interfaces';
import { SubscriptionFormComponent } from '../../components/subscription-form/subscription-form.component';
import { SubscriptionListComponent } from '../../components/subscription-list/subscription-list.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, SubscriptionFormComponent, SubscriptionListComponent],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  showForm = signal(false);
  editingSubscription = signal<Subscription | undefined>(undefined);
  filterStatus = signal<string>('all');

  subscriptions = this.subscriptionService.subscriptions;
  loading = this.subscriptionService.loading;
  currentUser = this.authService.currentUser;

  filteredSubscriptions = computed(() => {
    const filter = this.filterStatus();
    const subs = this.subscriptions();

    if (filter === 'all') return subs;
    return subs.filter(sub => sub.status === filter);
  });

  stats = computed(() => {
    return this.subscriptionService.calculateStats(this.subscriptions());
  });

  upcomingRenewals = computed(() => {
    return this.subscriptionService.getUpcomingRenewals();
  });

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.subscriptionService.getSubscriptions().subscribe({
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        alert('Failed to load subscriptions. Please try again.');
      }
    });
  }

  openNewSubscriptionForm(): void {
    this.editingSubscription.set(undefined);
    this.showForm.set(true);
  }

  openEditForm(subscription: Subscription): void {
    this.editingSubscription.set(subscription);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingSubscription.set(undefined);
  }

  handleFormSubmit(subscriptionData: Partial<Subscription>): void {
    const editing = this.editingSubscription();

    if (editing && editing._id) {
      this.subscriptionService.updateSubscription(editing._id, subscriptionData).subscribe({
        next: () => {
          this.closeForm();
          this.showSuccessMessage('Subscription updated successfully!');
        },
        error: (error) => {
          console.error('Error updating subscription:', error);
          alert('Failed to update subscription. Please try again.');
        }
      });
    } else {
      this.subscriptionService.createSubscription(subscriptionData).subscribe({
        next: () => {
          this.closeForm();
          this.showSuccessMessage('Subscription created successfully!');
        },
        error: (error) => {
          console.error('Error creating subscription:', error);
          alert('Failed to create subscription. Please try again.');
        }
      });
    }
  }

  handleDelete(id: string): void {
    this.subscriptionService.deleteSubscription(id).subscribe({
      next: () => {
        this.showSuccessMessage('Subscription deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting subscription:', error);
        alert('Failed to delete subscription. Please try again.');
      }
    });
  }

  setFilter(status: string): void {
    this.filterStatus.set(status);
  }

  getCurrencySymbol(currency: string): string {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'BRL': 'R$',
      'EUR': '€'
    };
    return symbols[currency] || currency;
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

  private showSuccessMessage(message: string): void {
    alert(message);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
