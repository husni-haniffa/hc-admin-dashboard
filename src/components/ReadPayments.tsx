"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useGetPaymentsQuery } from "@/features/payments/api";
import { useState, useMemo } from "react";

export interface ReadPaymentsProps {
  onUpdate?: (id: string) => void;
}

export default function ReadPayments({ onUpdate }: ReadPaymentsProps = {}) {
  const { data: payments, isLoading, isError } = useGetPaymentsQuery();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    if (!searchTerm.trim()) return payments;

    return payments.filter(payment =>
      payment.phoneNumber.includes(searchTerm.trim())
    );
  }, [payments, searchTerm]);

  if (isLoading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading payments...</p>
    </div>
  );
  if (isError) return (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-red-600 font-medium">Error loading payments</p>
      <p className="text-gray-500 text-sm mt-2">Please try refreshing the page</p>
    </div>
  );

  const handleEdit = (id: string) => {
    if (onUpdate) {
      onUpdate(id);
    } else {
      router.push(`/admin/update-payments/${id}`);
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Payment Records</h2>
        <p className="text-gray-600">View and manage all customer payment records</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <Label htmlFor="search" className="text-sm font-medium">Search by Phone Number</Label>
        <Input
          id="search"
          type="text"
          placeholder="Enter phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No payments found matching your search" : "No payments found"}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPayments.map((payment) => (
            <Card key={payment._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{payment.phoneNumber}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  Status:
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                    {payment.paymentStatus}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold">₹{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Paid</p>
                    <p className="font-semibold">₹{payment.paid}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Balance</p>
                    <p className="font-semibold">₹{payment.balance}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold">{payment.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-semibold text-xs">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Updated</p>
                    <p className="font-semibold text-xs">
                      {payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                {payment.note && (
                  <div>
                    <p className="text-gray-600 text-sm">Note</p>
                    <p className="text-sm truncate" title={payment.note}>{payment.note}</p>
                  </div>
                )}
                <Button
                  onClick={() => handleEdit(payment._id)}
                  className="w-full"
                  disabled={payment.paymentStatus === "Paid"}
                >
                  {payment.paymentStatus === "Paid" ? "Fully Paid" : "Update Payment"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
