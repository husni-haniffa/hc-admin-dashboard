"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { useCreatePaymentMutation } from "@/features/payments/api"


 const formSchema = z.object({
        phoneNumber: z.string().min(10, {message: "Invalid Phone Number"}).max(10, {message: "Invalid Phone Number"}),
        amount: z.number()
            .int({message: "Amount must be a whole number"})
            .refine((val) => {
                const str = val.toString();
                return str.length >= 3 && str.length <= 6;
            }, {message: "Amount must be between 3 and 6 digits"}),
        note: z.string().max(1000, {message: "Note is too long"})
    })

export default function CreatePaymentsPage () {

    const [createPayment, {isLoading}] = useCreatePaymentMutation()
    
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        phoneNumber: "",
        amount: 0,
        note: ""
    }
   })

   async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createPayment(values).unwrap()
            toast.success("Payment Created Successfully!")
            console.log("Payment created:", values)
            form.reset()
        } catch (error) {
            toast.error("Failed to Create Payment!")
            console.log("Payment Failed:", error)
        }
   }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Create New Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="phoneNumber" className="text-sm font-medium">
                                        Phone Number *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="phoneNumber"
                                            type="tel"
                                            placeholder="Enter 10-digit phone number"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="amount" className="text-sm font-medium">
                                        Amount (₹) *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            min="100"
                                            max="999999"
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
                                        Note
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="note"
                                            placeholder="Add any additional notes..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => form.reset()}
                        >
                            Clear Form
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Payment..." : "Create Payment"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}