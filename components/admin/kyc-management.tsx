"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Check, Eye, X } from "lucide-react"

export function KYCManagement() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Dados de exemplo
  const kycRequests = [
    {
      id: 1,
      user: "João Silva",
      email: "joao@example.com",
      status: "pending",
      submittedAt: "2023-05-15",
      documentType: "ID",
    },
    {
      id: 2,
      user: "Maria Oliveira",
      email: "maria@example.com",
      status: "approved",
      submittedAt: "2023-05-14",
      documentType: "Passport",
    },
    {
      id: 3,
      user: "Carlos Santos",
      email: "carlos@example.com",
      status: "rejected",
      submittedAt: "2023-05-10",
      documentType: "ID",
    },
    {
      id: 4,
      user: "Ana Pereira",
      email: "ana@example.com",
      status: "pending",
      submittedAt: "2023-05-15",
      documentType: "Driver License",
    },
    {
      id: 5,
      user: "Pedro Costa",
      email: "pedro@example.com",
      status: "approved",
      submittedAt: "2023-05-13",
      documentType: "ID",
    },
  ]

  const handleViewKYC = (user) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações KYC</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>

            {["pending", "approved", "rejected", "all"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo de Documento</TableHead>
                      <TableHead>Data de Envio</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycRequests
                      .filter((req) => tab === "all" || req.status === tab)
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.id}</TableCell>
                          <TableCell>{request.user}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>{request.documentType}</TableCell>
                          <TableCell>{request.submittedAt}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "approved"
                                  ? "default"
                                  : request.status === "rejected"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {request.status === "approved"
                                ? "Aprovado"
                                : request.status === "rejected"
                                  ? "Rejeitado"
                                  : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewKYC(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {request.status === "pending" && (
                                <>
                                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Verificação KYC - {selectedUser?.user}</DialogTitle>
            <DialogDescription>
              Revise os documentos enviados pelo usuário e aprove ou rejeite a solicitação.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Documento de Identidade</h3>
              <div className="border rounded-md overflow-hidden">
                <img src="/placeholder.svg?height=300&width=400" alt="ID Document" className="w-full h-auto" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Selfie com Documento</h3>
              <div className="border rounded-md overflow-hidden">
                <img src="/placeholder.svg?height=300&width=400" alt="Selfie with Document" className="w-full h-auto" />
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Comprovante de Residência</h3>
              <div className="border rounded-md overflow-hidden">
                <img src="/placeholder.svg?height=200&width=600" alt="Proof of Address" className="w-full h-auto" />
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Comentários</h3>
              <Textarea placeholder="Adicione comentários sobre a verificação..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
            {selectedUser?.status === "pending" && (
              <>
                <Button variant="destructive">Rejeitar</Button>
                <Button>Aprovar</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
