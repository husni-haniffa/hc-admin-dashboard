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

export default function CreatePaymentsPage () {
    return (
        <Card>
        <CardHeader>
            <CardTitle>New Pending Payment</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Label>Phone Number</Label>
                <Input type="number"/>
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