"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useGetPaymentsQuery } from "@/app/features/paymentApi";
import { useState, useMemo } from "react";

interface ReadPaymentsProps {
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

  if (isLoading) return <div className="text-center py-8">Loading payments...</div>;
  if (isError) return <div className="text-center py-8 text-red-600">Error loading payments</div>;

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
                <div className="grid grid-cols-2 gap-4 text-sm">
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
