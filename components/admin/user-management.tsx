"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, UserPlus, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados simulados de usuários
const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000, // Entre 2k e 12k
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Últimas 24h
    createdAt: "2023-01-10T08:15:00Z",
    kycStatus: "verified",
    avatar: "JS",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-01-15T09:20:00Z",
    kycStatus: "verified",
    avatar: "MO",
  },
  {
    id: "3",
    name: "Carlos Santos",
    email: "carlos.santos@example.com",
    status: "active",
    role: "affiliate",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-02-05T11:10:00Z",
    kycStatus: "verified",
    avatar: "CS",
  },
  {
    id: "4",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-02-10T14:30:00Z",
    kycStatus: "pending",
    avatar: "AP",
  },
  {
    id: "5",
    name: "Pedro Costa",
    email: "pedro.costa@example.com",
    status: "blocked",
    role: "user",
    balance: 0,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-02-15T10:45:00Z",
    kycStatus: "not_submitted",
    avatar: "PC",
  },
  {
    id: "6",
    name: "Luciana Mendes",
    email: "luciana.mendes@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-02-20T09:15:00Z",
    kycStatus: "verified",
    avatar: "LM",
  },
  {
    id: "7",
    name: "Roberto Alves",
    email: "roberto.alves@example.com",
    status: "active",
    role: "affiliate",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-03-01T13:20:00Z",
    kycStatus: "verified",
    avatar: "RA",
  },
  {
    id: "8",
    name: "Fernanda Lima",
    email: "fernanda.lima@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-03-05T11:30:00Z",
    kycStatus: "verified",
    avatar: "FL",
  },
  {
    id: "9",
    name: "Marcelo Souza",
    email: "marcelo.souza@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-03-10T10:15:00Z",
    kycStatus: "verified",
    avatar: "MS",
  },
  {
    id: "10",
    name: "Juliana Castro",
    email: "juliana.castro@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-03-15T09:45:00Z",
    kycStatus: "verified",
    avatar: "JC",
  },
  {
    id: "11",
    name: "Ricardo Ferreira",
    email: "ricardo.ferreira@example.com",
    status: "blocked",
    role: "user",
    balance: 0,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-03-20T13:10:00Z",
    kycStatus: "rejected",
    avatar: "RF",
  },
  {
    id: "12",
    name: "Camila Rodrigues",
    email: "camila.rodrigues@example.com",
    status: "active",
    role: "user",
    balance: Math.floor(Math.random() * 10000) + 2000,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    createdAt: "2023-03-25T11:20:00Z",
    kycStatus: "pending",
    avatar: "CR",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filtrar usuários com base nos critérios de pesquisa e filtros
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter

    return matchesSearch && matchesStatus && matchesRole && matchesKyc
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus as "active" | "blocked" } : user)))
  }

  const handleUserSelect = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuários..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>Ativos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("blocked")}>Bloqueados</DropdownMenuItem>

              <DropdownMenuLabel>Função</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRoleFilter("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("user")}>Usuários</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("affiliate")}>Afiliados</DropdownMenuItem>

              <DropdownMenuLabel>KYC</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setKycFilter("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter("verified")}>Verificados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter("pending")}>Pendentes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter("not_submitted")}>Não enviados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter("rejected")}>Rejeitados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button className="shrink-0">
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Gerenciamento de usuários da plataforma</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{filteredUsers.length} usuários</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder-text.png?text=${user.avatar}`} alt={user.name} />
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "success" : "destructive"}>
                      {user.status === "active" ? "Ativo" : "Bloqueado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role === "user" ? "Usuário" : user.role === "affiliate" ? "Afiliado" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(user.balance)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.kycStatus === "verified"
                          ? "success"
                          : user.kycStatus === "pending"
                            ? "warning"
                            : user.kycStatus === "rejected"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {user.kycStatus === "verified"
                        ? "Verificado"
                        : user.kycStatus === "pending"
                          ? "Pendente"
                          : user.kycStatus === "rejected"
                            ? "Rejeitado"
                            : "Não enviado"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUserSelect(user)}>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar usuário</DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "blocked")}>
                            Bloquear usuário
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                            Ativar usuário
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>Informações detalhadas sobre {selectedUser.name}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="trades">Operações</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder-text.png?text=${selectedUser.avatar}`} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={selectedUser.status === "active" ? "success" : "destructive"}>
                        {selectedUser.status === "active" ? "Ativo" : "Bloqueado"}
                      </Badge>
                      <Badge variant="outline">
                        {selectedUser.role === "user"
                          ? "Usuário"
                          : selectedUser.role === "affiliate"
                            ? "Afiliado"
                            : "Admin"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Informações Pessoais</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Nome:</span>
                        <span className="text-sm font-medium">{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Email:</span>
                        <span className="text-sm font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">CPF:</span>
                        <span className="text-sm font-medium">123.456.789-00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Telefone:</span>
                        <span className="text-sm font-medium">(11) 98765-4321</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Informações da Conta</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">ID:</span>
                        <span className="text-sm font-medium">{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data de Cadastro:</span>
                        <span className="text-sm font-medium">{formatDate(selectedUser.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Último Login:</span>
                        <span className="text-sm font-medium">{formatDate(selectedUser.lastLogin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant={selectedUser.status === "active" ? "success" : "destructive"}>
                          {selectedUser.status === "active" ? "Ativo" : "Bloqueado"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Saldo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(selectedUser.balance)}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Depósitos Totais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(selectedUser.balance * 1.5)}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Últimas Transações</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Badge>Depósito</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(2500)}</TableCell>
                          <TableCell>
                            <Badge variant="success">Aprovado</Badge>
                          </TableCell>
                          <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Badge variant="secondary">Saque</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(1000)}</TableCell>
                          <TableCell>
                            <Badge variant="success">Aprovado</Badge>
                          </TableCell>
                          <TableCell>{formatDate(new Date(Date.now() - 86400000).toISOString())}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Badge>Depósito</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(5000)}</TableCell>
                          <TableCell>
                            <Badge variant="success">Aprovado</Badge>
                          </TableCell>
                          <TableCell>{formatDate(new Date(Date.now() - 172800000).toISOString())}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trades" className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total de Operações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">247</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Taxa de Acerto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">58.3%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Lucro Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(12500)}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Últimas Operações</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ativo</TableHead>
                          <TableHead>Direção</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Resultado</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>BTC/USD</TableCell>
                          <TableCell>
                            <Badge variant="outline">Alta</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(500)}</TableCell>
                          <TableCell>
                            <Badge variant="success">Ganho</Badge>
                          </TableCell>
                          <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ETH/USD</TableCell>
                          <TableCell>
                            <Badge variant="outline">Baixa</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(300)}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Perda</Badge>
                          </TableCell>
                          <TableCell>{formatDate(new Date(Date.now() - 3600000).toISOString())}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>EUR/USD</TableCell>
                          <TableCell>
                            <Badge variant="outline">Alta</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(250)}</TableCell>
                          <TableCell>
                            <Badge variant="success">Ganho</Badge>
                          </TableCell>
                          <TableCell>{formatDate(new Date(Date.now() - 7200000).toISOString())}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kyc" className="space-y-4 py-4">
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    variant={
                      selectedUser.kycStatus === "verified"
                        ? "success"
                        : selectedUser.kycStatus === "pending"
                          ? "warning"
                          : selectedUser.kycStatus === "rejected"
                            ? "destructive"
                            : "outline"
                    }
                    className="px-3 py-1 text-sm"
                  >
                    {selectedUser.kycStatus === "verified"
                      ? "Verificado"
                      : selectedUser.kycStatus === "pending"
                        ? "Pendente"
                        : selectedUser.kycStatus === "rejected"
                          ? "Rejeitado"
                          : "Não enviado"}
                  </Badge>

                  {selectedUser.kycStatus === "pending" && (
                    <div className="flex gap-2">
                      <Button variant="success" size="sm">
                        Aprovar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>

                {selectedUser.kycStatus !== "not_submitted" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Documento de Identidade</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                          <img
                            src="/generic-identification-card.png"
                            alt="Documento de Identidade"
                            className="max-h-full object-contain"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Selfie com Documento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                          <img
                            src="/person-holding-identification.png"
                            alt="Selfie com Documento"
                            className="max-h-full object-contain"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Comprovante de Residência</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                          <img
                            src="/utility-bill-close-up.png"
                            alt="Comprovante de Residência"
                            className="max-h-full object-contain"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Informações Enviadas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Nome Completo:</span>
                            <span className="text-sm font-medium">{selectedUser.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">CPF:</span>
                            <span className="text-sm font-medium">123.456.789-00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Data de Nascimento:</span>
                            <span className="text-sm font-medium">15/05/1985</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Endereço:</span>
                            <span className="text-sm font-medium">Rua das Flores, 123</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Cidade/UF:</span>
                            <span className="text-sm font-medium">São Paulo/SP</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {selectedUser.kycStatus === "not_submitted" && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Este usuário ainda não enviou documentos para verificação KYC.
                    </p>
                    <Button variant="outline">Solicitar Documentos</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
