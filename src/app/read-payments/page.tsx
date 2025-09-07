"use client";  // 👈 this makes it a Client Component

import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ReadPayments() {

  return (
    <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Payment Status:</CardDescription>
            <CardAction>Edit</CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Phone Number</Label>
              <Input type="number" readOnly />
              <Label>Amount</Label>
              <Input type="number" readOnly />
              <Label>Paid</Label>
              <Input type="number" readOnly />
              <Label>Balance</Label>
              <Input type="number" readOnly />
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
