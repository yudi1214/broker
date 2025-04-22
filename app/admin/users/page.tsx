import { UserManagement } from "@/components/admin/user-management"

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
      <UserManagement />
    </div>
  )
}
