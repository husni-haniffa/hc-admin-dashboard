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

export default function UpdatePaymentsPage () {
    return (
        <Card>
        <CardHeader>
            <CardTitle>Update Pending Payment</CardTitle>
            <CardDescription>Pending: 500</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Label>Phone Number</Label>
                <Input type="number" readOnly/>
                <Label>Paid Amount</Label>
                <Input type="number" readOnly/>
            </div>
        </CardContent>
        <CardFooter>
            <div className="flex space-x-6">
                <Button className="bg-red-600 hover:bg-red-500">Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-500">Submit</Button>
            </div>
        </CardFooter>
        </Card>
    )
}