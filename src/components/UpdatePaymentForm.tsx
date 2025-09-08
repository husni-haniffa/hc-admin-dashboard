"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useGetPaymentByIdQuery, useUpdatePaymentMutation } from "@/features/payments/api";

// form validation schema
const formSchema = z.object({
  note: z.string().max(1000, { message: "Note is too long" }),
  paidAmount: z
    .number()
    .int({ message: "Amount must be a whole number" })
    .refine(
      (val) => {
        const str = val.toString();
        return str.length >= 3 && str.length <= 6;
      },
      { message: "Amount must be between 3 and 6 digits" }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdatePaymentFormProps {
  id: string;
  onCancel: () => void;
}

export default function UpdatePaymentForm({ id, onCancel }: UpdatePaymentFormProps) {
  const { data: payment, isLoading, isError } = useGetPaymentByIdQuery(id);
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      paidAmount: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updatePayment({
        id: id,
        paidAmount: values.paidAmount,
        note: values.note,
      }).unwrap();

      toast.success("Payment updated successfully!");
      form.reset();
      onCancel(); // Go back to list
    } catch (error) {
      toast.error("Failed to update payment");
    }
  }

  if (isLoading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading payment details...</p>
    </div>
  );
  if (isError) return (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-red-600 font-medium">Error loading payment</p>
      <p className="text-gray-500 text-sm mt-2">Please try again later</p>
    </div>
  );

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Update Payment</CardTitle>
        <CardDescription className="flex items-center gap-2">
          Current Status:
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              payment?.paymentStatus || ""
            )}`}
          >
            {payment?.paymentStatus}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={payment?.phoneNumber}
                readOnly
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Total Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                value={payment?.amount}
                readOnly
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="paid" className="text-sm font-medium text-gray-700">
                Total Paid (₹)
              </Label>
              <Input
                id="paid"
                type="number"
                value={payment?.paid}
                readOnly
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="balance" className="text-sm font-medium text-gray-700">
                Remaining Balance (₹)
              </Label>
              <Input
                id="balance"
                type="number"
                value={payment?.balance}
                readOnly
                className="mt-1 bg-white"
              />
            </div>
          </div>

          {/* Editable form fields */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="paidAmount" className="text-sm font-medium">
                      Additional Payment Amount (₹) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="paidAmount"
                        type="number"
                        placeholder="Enter payment amount"
                        min="1"
                        max={payment?.balance || 999999}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="note" className="text-sm font-medium">
                      Update Note
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="note"
                        placeholder="Add payment notes..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 px-0">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating Payment..." : "Update Payment"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}