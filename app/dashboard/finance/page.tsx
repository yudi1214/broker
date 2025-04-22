"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositForm } from "@/components/finance/deposit-form"
import { WithdrawForm } from "@/components/finance/withdraw-form"
import { TransactionsTab } from "@/components/finance/transactions-tab"

export default function FinancePage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState("deposit")

  useEffect(() => {
    if (tabParam && ["deposit", "withdraw", "transactions"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="deposit">Depósito</TabsTrigger>
          <TabsTrigger value="withdraw">Saque</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <DepositForm />
        </TabsContent>

        <TabsContent value="withdraw">
          <WithdrawForm />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
