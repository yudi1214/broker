"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, ExternalLink, QrCode, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WalletPage() {
  const { toast } = useToast()
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferAddress, setTransferAddress] = useState("")

  // Dados de exemplo
  const wallets = [
    {
      id: 1,
      type: "BTC",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      balance: 0.25,
      usdValue: 16250,
    },
    {
      id: 2,
      type: "ETH",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      balance: 5.75,
      usdValue: 19890,
    },
    {
      id: 3,
      type: "USDT",
      address: "0x8Fc5d6FeD8D9a278aB5bb5A0F5001132D196B6c9",
      balance: 25000,
      usdValue: 25000,
    },
  ]

  const transactions = [
    {
      id: 1,
      type: "deposit",
      asset: "BTC",
      amount: 0.15,
      usdValue: 9750,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      txid: "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
      status: "completed",
      timestamp: "2023-05-15 14:32:45",
    },
    {
      id: 2,
      type: "withdrawal",
      asset: "ETH",
      amount: 2.5,
      usdValue: 8650,
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      txid: "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060",
      status: "completed",
      timestamp: "2023-05-14 09:15:22",
    },
    {
      id: 3,
      type: "deposit",
      asset: "USDT",
      amount: 10000,
      usdValue: 10000,
      address: "0x8Fc5d6FeD8D9a278aB5bb5A0F5001132D196B6c9",
      txid: "0x4a563af33c4871b51a8b108aa2fe1dd5280a30dfb7236170ae5e5e7957eb6392",
      status: "completed",
      timestamp: "2023-05-10 18:45:10",
    },
    {
      id: 4,
      type: "withdrawal",
      asset: "BTC",
      amount: 0.05,
      usdValue: 3250,
      address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
      txid: "ea44e97271691990157559d0bdd9959e02790c34db6c006d779e82fa5aee708e",
      status: "pending",
      timestamp: "2023-05-16 11:22:33",
    },
  ]

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0)

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Endereço copiado",
      description: "O endereço foi copiado para a área de transferência.",
    })
  }

  const handleTransfer = () => {
    if (!transferAmount || !transferAddress) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Transferência iniciada",
      description: `Transferência de ${transferAmount} BTC para ${transferAddress} iniciada com sucesso.`,
    })

    setIsTransferDialogOpen(false)
    setTransferAmount("")
    setTransferAddress("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Carteira da Plataforma</h2>
        <Button onClick={() => setIsTransferDialogOpen(true)}>
          <Send className="mr-2 h-4 w-4" />
          Transferir Fundos
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor total em USD</p>
          </CardContent>
        </Card>

        {wallets.map((wallet) => (
          <Card key={wallet.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{wallet.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {wallet.balance} {wallet.type}
              </div>
              <p className="text-xs text-muted-foreground">$ {wallet.usdValue.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="wallets" className="w-full">
        <TabsList>
          <TabsTrigger value="wallets">Carteiras</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endereços da Carteira</CardTitle>
              <CardDescription>Endereços para depósito e gerenciamento de fundos da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Valor (USD)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="truncate max-w-[200px]">{wallet.address}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyAddress(wallet.address)}
                            className="h-8 w-8 ml-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {wallet.balance} {wallet.type}
                      </TableCell>
                      <TableCell>$ {wallet.usdValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setIsTransferDialogOpen(true)}>
                          Transferir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>Histórico de depósitos e saques da carteira da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor (USD)</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>TXID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Badge variant={tx.type === "deposit" ? "default" : "secondary"}>
                          {tx.type === "deposit" ? "Depósito" : "Saque"}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell>
                        {tx.amount} {tx.asset}
                      </TableCell>
                      <TableCell>$ {tx.usdValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="truncate max-w-[100px]">{tx.address}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyAddress(tx.address)}
                            className="h-8 w-8 ml-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="truncate max-w-[100px]">{tx.txid}</span>
                          <a
                            href={`https://etherscan.io/tx/${tx.txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2"
                          >
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "completed" ? "default" : tx.status === "pending" ? "outline" : "destructive"
                          }
                        >
                          {tx.status === "completed" ? "Concluído" : tx.status === "pending" ? "Pendente" : "Falhou"}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transferir Fundos</DialogTitle>
            <DialogDescription>Transfira fundos da carteira da plataforma para outro endereço.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Ativo</Label>
              <select
                id="asset"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Quantidade</Label>
              <Input
                id="amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                type="number"
                step="0.00000001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço de Destino</Label>
              <Input
                id="address"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="Endereço da carteira de destino"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input id="description" placeholder="Motivo da transferência" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleTransfer}>Transferir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
