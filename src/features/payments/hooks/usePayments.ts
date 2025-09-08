import { useMemo } from 'react';
import { useGetPaymentsQuery } from '../api';
import { filterPayments, sortPaymentsByDate } from '../utils';
import { PaymentFilters } from '../types';

/**
 * Custom hook for payments data with filtering and sorting
 */
export function usePayments(filters: PaymentFilters = { searchTerm: '' }) {
  const { data: payments = [], isLoading, error } = useGetPaymentsQuery();

  const filteredAndSortedPayments = useMemo(() => {
    let result = payments;

    // Apply search filter
    if (filters.searchTerm) {
      result = filterPayments(result, filters.searchTerm);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(payment => payment.paymentStatus === filters.status);
    }

    // Sort by date (newest first)
    result = sortPaymentsByDate(result);

    return result;
  }, [payments, filters]);

  return {
    payments: filteredAndSortedPayments,
    allPayments: payments,
    isLoading,
    error,
    totalCount: payments.length,
    filteredCount: filteredAndSortedPayments.length,
  };
}

/**
 * Custom hook for payment statistics
 */
export function usePaymentStats() {
  const { payments, isLoading } = usePayments();

  const stats = useMemo(() => {
    if (isLoading || !payments.length) {
      return {
        totalPayments: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
        paidCount: 0,
        partialCount: 0,
        unpaidCount: 0,
      };
    }

    return {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      totalPaid: payments.reduce((sum, p) => sum + p.paid, 0),
      totalBalance: payments.reduce((sum, p) => sum + p.balance, 0),
      paidCount: payments.filter(p => p.paymentStatus === 'Paid').length,
      partialCount: payments.filter(p => p.paymentStatus === 'Partial').length,
      unpaidCount: payments.filter(p => p.paymentStatus === 'Unpaid').length,
    };
  }, [payments, isLoading]);

  return stats;
}