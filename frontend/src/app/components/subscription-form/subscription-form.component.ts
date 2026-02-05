import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from '../../models/interfaces';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.css'
})
export class SubscriptionFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() subscription?: Subscription;
  @Input() isEdit = false;
  @Output() formSubmit = new EventEmitter<Partial<Subscription>>();
  @Output() formCancel = new EventEmitter<void>();

  subscriptionForm!: FormGroup;

  frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  categories = [
    { value: 'tech', label: 'Technology' },
    { value: 'games', label: 'Games' },
    { value: 'sports', label: 'Sports' },
    { value: 'news', label: 'News' },
    { value: 'finance', label: 'Finance' },
    { value: 'politics', label: 'Politics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'education', label: 'Education' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'music', label: 'Music' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'health & fitness', label: 'Health & Fitness' },
    { value: 'other', label: 'Other' },
  ];

  paymentMethods = [
    'Credit Card',
    'Debit Card',
    'PayPal',
    'Bank Transfer',
    'Other'
  ];

  currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'BRL', label: 'BRL (R$)' },
    { value: 'EUR', label: 'EUR (€)' }
  ];

  ngOnInit(): void {
    this.initForm();
    if (this.subscription && this.isEdit) {
      this.patchForm();
    }
  }

  initForm(): void {
    this.subscriptionForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      frequency: ['monthly', Validators.required],
      category: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  patchForm(): void {
    if (this.subscription) {
      this.subscriptionForm.patchValue({
        name: this.subscription.name,
        price: this.subscription.price,
        currency: this.subscription.currency,
        frequency: this.subscription.frequency,
        category: this.subscription.category,
        paymentMethod: this.subscription.paymentMethod,
        startDate: this.formatDateForInput(this.subscription.startDate)
      });
    }
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const formValue = this.subscriptionForm.value;
    const subscriptionData: Partial<Subscription> = {
      ...formValue,
      startDate: new Date(formValue.startDate)
    };

    this.formSubmit.emit(subscriptionData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  get name() { return this.subscriptionForm.get('name'); }
  get price() { return this.subscriptionForm.get('price'); }
  get currency() { return this.subscriptionForm.get('currency'); }
  get frequency() { return this.subscriptionForm.get('frequency'); }
  get category() { return this.subscriptionForm.get('category'); }
  get paymentMethod() { return this.subscriptionForm.get('paymentMethod'); }
  get startDate() { return this.subscriptionForm.get('startDate'); }
}
