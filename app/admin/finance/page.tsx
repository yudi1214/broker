import { FinanceManagement } from "@/components/admin/finance-management"

export default function AdminFinancePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciamento Financeiro</h1>
      <FinanceManagement />
    </div>
  )
}
