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
import { useGetPaymentByIdQuery, useUpdatePaymentMutation } from "@/app/features/paymentApi"

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
  const id = params.id as string

  const { data: payment, isLoading, isError } = useGetPaymentByIdQuery(id)
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
        id: id,
        paidAmount: values.paidAmount,
        note: values.note,
      }).unwrap()

      toast.success("Payment updated successfully!")
      form.reset()
    } catch (error) {
      toast.error("Failed to update payment")
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading payment</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Pending Payment</CardTitle>
        <CardDescription>
          Payment Status: {payment?.paymentStatus}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Read-only fields */}
          <Label>Phone Number</Label>
          <Input type="number" value={payment?.phoneNumber} readOnly />

          <Label>Amount</Label>
          <Input type="number" value={payment?.amount} readOnly />
             <Label>Paid</Label>
          <Input type="number" value={payment?.paid} readOnly />
           <Label>Balance</Label>
          <Input type="number" value={payment?.balance} readOnly />
          {/* Editable form fields */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex space-x-6">
                <Button type="button" className="bg-red-600 hover:bg-red-500">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Submit"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
