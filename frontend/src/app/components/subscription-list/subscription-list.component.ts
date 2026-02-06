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

  readonly statusLabelMap: Record<string, string> = {
    active: 'Ativo',
    expired: 'Expirado',
    canceled: 'Cancelado'
  };

  readonly paymentMethodLabelMap: Record<string, string> = {
    'credit-card': 'Cartão de Crédito',
    'debit-card': 'Cartão de Débito',
    'paypal': 'PayPal',
    'bank-transfer': 'Transferência Bancária',
    'other': 'Outro'
  };

  readonly frequencyLabelMap: Record<string, string> = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    yearly: 'Anual'
  };

  readonly categoryLabelMap: Record<string, string> = {
    'tech': 'Tecnologia',
    'games': 'Jogos',
    'sports': 'Esportes',
    'news': 'Notícias',
    'finance': 'Finanças',
    'politics': 'Política',
    'entertainment': 'Entretenimento',
    'education': 'Educação',
    'lifestyle': 'Estilo de Vida',
    'music': 'Música',
    'productivity': 'Produtividade',
    'health & fitness': 'Saúde e Fitness',
    'other': 'Outro'
  };

  getStatusLabel(status: string): string {
    return this.statusLabelMap[status] ?? status;
  }

  getPaymentMethodLabel(method: string): string {
    return this.paymentMethodLabelMap[method] ?? method;
  }

  getFrequencyLabel(frequency: string): string {
    return this.frequencyLabelMap[frequency] ?? frequency;
  }

  getCategoryLabel(category: string): string {
    return this.categoryLabelMap[category] ?? category;
  }

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
