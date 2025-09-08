import { Payment } from '../types';

/**
 * Get status color for payment status badges
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "Paid":
      return "text-green-600 bg-green-100";
    case "Partial":
      return "text-yellow-600 bg-yellow-100";
    case "Unpaid":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString()}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}

/**
 * Calculate payment progress percentage
 */
export function getPaymentProgress(paid: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((paid / total) * 100);
}

/**
 * Filter payments by search term
 */
export function filterPayments(payments: Payment[], searchTerm: string): Payment[] {
  if (!searchTerm.trim()) return payments;

  return payments.filter(payment =>
    payment.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

/**
 * Sort payments by date (newest first)
 */
export function sortPaymentsByDate(payments: Payment[]): Payment[] {
  return [...payments].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}