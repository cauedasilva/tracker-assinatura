import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../models/interfaces';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.css'
})
export class SubscriptionListComponent {
  @Input() subscriptions: Subscription[] = [];
  @Input() loading = false;
  @Output() editSubscription = new EventEmitter<Subscription>();
  @Output() deleteSubscription = new EventEmitter<string>();

  onEdit(subscription: Subscription): void {
    this.editSubscription.emit(subscription);
  }

  onDelete(id: string | undefined): void {
    if (id && confirm('Você tem certeza que deseja excluir esta assinatura?')) {
      this.deleteSubscription.emit(id);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'expired':
        return 'status-expired';
      case 'canceled':
        return 'status-canceled';
      default:
        return '';
    }
  }

  getCurrencySymbol(currency: string): string {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'BRL': 'R$',
      'EUR': '€'
    };
    return symbols[currency] || currency;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysUntilRenewal(renewalDate: Date): number {
    const now = new Date();
    const renewal = new Date(renewalDate);
    const diff = renewal.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isRenewalSoon(renewalDate: Date): boolean {
    const days = this.getDaysUntilRenewal(renewalDate);
    return days >= 0 && days <= 7;
  }
}
