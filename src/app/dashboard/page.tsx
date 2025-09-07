import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreatePaymentsPage from "../create-payments/page"
import UpdatePaymentsPage from "../update-payments/page"
import ReadPayments from "../read-payments/page"

export default function AdminDashboardPage() {
    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <Tabs defaultValue="create-payments-info" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="create-payments-info">Create</TabsTrigger>
                <TabsTrigger value="read-payments-info">Read</TabsTrigger>
                 <TabsTrigger value="update-payments-info">Update</TabsTrigger>
            </TabsList>
            <TabsContent value="create-payments-info"><CreatePaymentsPage/></TabsContent>
            <TabsContent value="read-payments-info"><ReadPayments/></TabsContent>
            <TabsContent value="update-payments-info"><UpdatePaymentsPage/></TabsContent>
            </Tabs>
        </div>
    )
}