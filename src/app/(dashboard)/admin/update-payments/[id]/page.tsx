"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "next/navigation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useGetPaymentByIdQuery, useUpdatePaymentMutation } from "@/features/payments/api"
import Navbar from "@/components/Navbar"

// form validation schema
const formSchema = z.object({
  note: z.string().max(1000, {message: "Note is too long"}),
  paidAmount: z.number()
            .int({message: "Amount must be a whole number"})
            .refine((val) => {
                const str = val.toString();
                return str.length >= 3 && str.length <= 6;
            }, {message: "Amount must be between 3 and 6 digits"}),
})

type FormValues = z.infer<typeof formSchema>

export default function UpdatePaymentsPage() {
  const params = useParams()
  const id = (params as { id?: string }).id

  const { data: payment, isLoading, isError } = useGetPaymentByIdQuery(id as string, { skip: !id })
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      paidAmount: 0,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await updatePayment({
        id: id as string,
        paidAmount: values.paidAmount,
        note: values.note,
      }).unwrap()

      toast.success("Payment updated successfully!")
      form.reset()
    } catch {
      toast.error("Failed to update payment")
    }
  }

  if (id && isLoading) return <p>Loading...</p>
  if (id && isError) return <p>Error loading payment</p>

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 max-w-2xl">
        {!id ? (
          <Card className="w-full">
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No Payment Selected</h2>
              <p className="text-gray-600 mb-6">Please select a payment to update from the dashboard.</p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Update Payment</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Current Status:
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment?.paymentStatus || "")}`}>
                  {payment?.paymentStatus}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Read-only fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
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
                  <div>
                    <Label htmlFor="createdAt" className="text-sm font-medium text-gray-700">
                      Created At
                    </Label>
                    <Input
                      id="createdAt"
                      type="text"
                      value={payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'}
                      readOnly
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="updatedAt" className="text-sm font-medium text-gray-700">
                      Updated At
                    </Label>
                    <Input
                      id="updatedAt"
                      type="text"
                      value={payment?.updatedAt ? new Date(payment.updatedAt).toLocaleString() : 'N/A'}
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
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || 0)
                              }
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
                        onClick={() => window.history.back()}
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
        )}
      </div>
    </div>
  )
}
