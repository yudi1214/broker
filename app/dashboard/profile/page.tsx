import { UserProfile } from "@/components/user/user-profile"

export default function ProfilePage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      <UserProfile />
    </div>
  )
}
