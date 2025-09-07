import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ReadPayments () {
    return (
        <Card>
        <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Payment Status</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Label>Phone Number</Label>
                <Input type="number" readOnly/>
                <Label>Amount</Label>
                <Input type="number" readOnly/>
                <Label>Balance</Label>
                <Input type="number" readOnly/>
            </div>
        </CardContent>
        </Card>
    )
}