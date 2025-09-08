"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGetPaymentsQuery } from "../features/paymentApi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function ReadPayments() {
  const { data: payments, isLoading, isError, isSuccess } = useGetPaymentsQuery();
  const router = useRouter()

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading payments</div>;

  const handleEdit = (id: string) => {
     router.push(`/update-payments/${id}`);
  }

  return (
    <div className="space-y-4">
      {payments?.map((payment) => (
        <Card key={payment._id}>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>{payment.paymentStatus}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label>Phone Number</Label>
              <Input type="text" readOnly value={payment.phoneNumber} />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" readOnly value={payment.amount} />
            </div>
            <div>
              <Label>Paid</Label>
              <Input type="number" readOnly value={payment.paid} />
            </div>
            <div>
              <Label>Balance</Label>
              <Input type="number" readOnly value={payment.balance} />
            </div>
            <Button onClick={() => handleEdit(payment._id)}>Edit</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
