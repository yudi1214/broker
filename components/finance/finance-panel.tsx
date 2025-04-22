"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccountStore } from "@/lib/stores/account-store"
import { useUserStore } from "@/lib/stores/user-store"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DepositForm } from "./deposit-form"
import { WithdrawForm } from "./withdraw-form"
import { TransactionsHistory } from "./transactions-history"

export function FinancePanel() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const { deposits, withdrawals } = useFinanceStore()

  const balance = accountType === "real" ? user?.realBalance || 0 : user?.demoBalance || 0

  const filteredDeposits = deposits.filter((deposit) => deposit.accountType === accountType)
  const filteredWithdrawals = withdrawals.filter((withdrawal) => withdrawal.accountType === accountType)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Disponível</CardTitle>
            <CardDescription>Seu saldo atual na conta {accountType === "demo" ? "demo" : "real"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
                <div className={`text-sm ${accountType === "demo" ? "text-warning" : "text-success"}`}>
                  Conta {accountType === "demo" ? "Demo" : "Real"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {accountType === "demo" && (
          <Card>
            <CardHeader>
              <CardTitle>Conta Demo</CardTitle>
              <CardDescription>Informações sobre sua conta demo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A conta demo é apenas para fins de teste e prática. Você não pode fazer depósitos ou saques em uma conta
                demo.
              </p>
              <p className="text-sm text-muted-foreground">
                Para operar com dinheiro real, alterne para a conta real no menu lateral ou no topo da tela.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {accountType === "real" && (
        <Tabs defaultValue="deposit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Depósito</TabsTrigger>
            <TabsTrigger value="withdraw">Saque</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <div className="grid gap-4 md:grid-cols-2">
              <DepositForm />

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Depósitos</CardTitle>
                  <CardDescription>Seus últimos depósitos</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredDeposits.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Nenhum depósito realizado ainda</div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDeposits.slice(0, 5).map((deposit) => (
                            <TableRow key={deposit.id}>
                              <TableCell className="font-medium">{formatDate(new Date(deposit.timestamp))}</TableCell>
                              <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    deposit.status === "approved"
                                      ? "success"
                                      : deposit.status === "pending"
                                        ? "warning"
                                        : "destructive"
                                  }
                                >
                                  {deposit.status === "approved"
                                    ? "Aprovado"
                                    : deposit.status === "pending"
                                      ? "Pendente"
                                      : "Recusado"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="withdraw">
            <div className="grid gap-4 md:grid-cols-2">
              <WithdrawForm />

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Saques</CardTitle>
                  <CardDescription>Seus últimos saques</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredWithdrawals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Nenhum saque realizado ainda</div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredWithdrawals.slice(0, 5).map((withdrawal) => (
                            <TableRow key={withdrawal.id}>
                              <TableCell className="font-medium">
                                {formatDate(new Date(withdrawal.timestamp))}
                              </TableCell>
                              <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    withdrawal.status === "approved"
                                      ? "success"
                                      : withdrawal.status === "pending"
                                        ? "warning"
                                        : "destructive"
                                  }
                                >
                                  {withdrawal.status === "approved"
                                    ? "Aprovado"
                                    : withdrawal.status === "pending"
                                      ? "Pendente"
                                      : "Recusado"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsHistory />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
