"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreatePaymentsPage from "../create-payments/page"
import ReadPayments from "../read-payments/page"
import UpdatePaymentForm from "@/components/UpdatePaymentForm"
import Navbar from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("create-payments-info")
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto p-4 max-w-7xl">
                <h1 className="text-3xl font-bold text-center mb-8 mt-6">Payment Management Dashboard</h1>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="create-payments-info" className="text-sm md:text-base">Create Payment</TabsTrigger>
                        <TabsTrigger value="read-payments-info" className="text-sm md:text-base">View Payments</TabsTrigger>
                        <TabsTrigger value="update-payments-info" className="text-sm md:text-base">Update Payment</TabsTrigger>
                    </TabsList>
                    <TabsContent value="create-payments-info" className="mt-6">
                        <CreatePaymentsPage/>
                    </TabsContent>
                    <TabsContent value="read-payments-info" className="mt-6">
                        <ReadPayments
                            onUpdate={(id) => {
                                setSelectedPaymentId(id);
                                setActiveTab("update-payments-info");
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="update-payments-info" className="mt-6">
                        {selectedPaymentId ? (
                            <UpdatePaymentForm
                                id={selectedPaymentId}
                                onCancel={() => {
                                    setSelectedPaymentId(null);
                                    setActiveTab("read-payments-info");
                                }}
                            />
                        ) : (
                            <Card className="w-full max-w-2xl mx-auto">
                                <CardContent className="text-center py-12">
                                    <h2 className="text-2xl font-semibold mb-4">Update Payment</h2>
                                    <p className="text-gray-600 mb-6">Please select a payment to update from the "View Payments" tab.</p>
                                    <Button onClick={() => setActiveTab("read-payments-info")}>
                                        Go to View Payments
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}