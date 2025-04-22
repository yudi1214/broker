"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function FinanceManagement() {
  // Dados de exemplo
  const deposits = [
    { id: 1, user: "João Silva", amount: 500, method: "PIX", status: "pending", date: "2023-05-15" },
    { id: 2, user: "Maria Oliveira", amount: 1000, method: "PIX", status: "completed", date: "2023-05-14" },
    { id: 3, user: "Carlos Santos", amount: 250, method: "PIX", status: "pending", date: "2023-05-14" },
  ]

  const withdrawals = [
    { id: 1, user: "João Silva", amount: 300, method: "PIX", status: "pending", date: "2023-05-15" },
    { id: 2, user: "Maria Oliveira", amount: 500, method: "PIX", status: "completed", date: "2023-05-14" },
    { id: 3, user: "Carlos Santos", amount: 150, method: "PIX", status: "pending", date: "2023-05-14" },
  ]

  return (
    <Tabs defaultValue="deposits">
      <TabsList className="mb-4">
        <TabsTrigger value="deposits">Depósitos</TabsTrigger>
        <TabsTrigger value="withdrawals">Saques</TabsTrigger>
        <TabsTrigger value="transactions">Transações</TabsTrigger>
      </TabsList>

      <TabsContent value="deposits">
        <Card>
          <CardHeader>
            <CardTitle>Depósitos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{deposit.id}</TableCell>
                    <TableCell>{deposit.user}</TableCell>
                    <TableCell>R$ {deposit.amount}</TableCell>
                    <TableCell>{deposit.method}</TableCell>
                    <TableCell>{deposit.date}</TableCell>
                    <TableCell>
                      <Badge variant={deposit.status === "pending" ? "outline" : "default"}>
                        {deposit.status === "pending" ? "Pendente" : "Concluído"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {deposit.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="withdrawals">
        <Card>
          <CardHeader>
            <CardTitle>Saques Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{withdrawal.id}</TableCell>
                    <TableCell>{withdrawal.user}</TableCell>
                    <TableCell>R$ {withdrawal.amount}</TableCell>
                    <TableCell>{withdrawal.method}</TableCell>
                    <TableCell>{withdrawal.date}</TableCell>
                    <TableCell>
                      <Badge variant={withdrawal.status === "pending" ? "outline" : "default"}>
                        {withdrawal.status === "pending" ? "Pendente" : "Concluído"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...deposits, ...withdrawals].map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.user}</TableCell>
                    <TableCell>{index < deposits.length ? "Depósito" : "Saque"}</TableCell>
                    <TableCell>R$ {transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "pending" ? "outline" : "default"}>
                        {transaction.status === "pending" ? "Pendente" : "Concluído"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
