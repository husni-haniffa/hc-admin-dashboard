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
import { useCreatePaymentMutation } from "@/app/features/paymentApi"


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

    const [createPayment, {isLoading, isError, isSuccess}] = useCreatePaymentMutation()
    
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
            toast("Success: Payment Created!")
            console.log("Payment created:", values)
            form.reset()
        } catch (error) {
            toast("Error: Payment Failed!")
            console.log("Payment Failed:", error)
        }
   }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="mb-6">New Pending Payment</CardTitle>
                </CardHeader>
                <CardContent>   
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
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
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} 
                               onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} />
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
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </CardContent>
                <CardFooter className="mt-6">
                    <div className="flex space-x-6">
                        <Button className="bg-red-600 hover:bg-red-500">Cancel</Button>
                        <Button 
                            className="bg-green-600 hover:bg-green-500" 
                            type="submit">
                            {isLoading ? "Submitting": "Submit"}
                        </Button>
                    </div>
                </CardFooter>
                </form>
            </Form>
        </Card>
    )
}