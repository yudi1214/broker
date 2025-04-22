import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role: string
  status: "active" | "blocked"
  demoBalance: number
  realBalance: number
}

interface UserState {
  user: User | null
  users: User[]
  updateUser: (user: User) => void
  updateUserBalance: (accountType: "demo" | "real", balance: number) => void
  deleteUser: (userId: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: "2",
        name: "Demo User",
        email: "user@example.com",
        role: "user",
        status: "active",
        demoBalance: 10000,
        realBalance: 0,
        image: "",
      },
      users: [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          demoBalance: 10000,
          realBalance: 5000,
          image: "",
        },
        {
          id: "2",
          name: "Demo User",
          email: "user@example.com",
          role: "user",
          status: "active",
          demoBalance: 10000,
          realBalance: 0,
          image: "",
        },
        {
          id: "3",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          demoBalance: 8500,
          realBalance: 2500,
          image: "",
        },
        {
          id: "4",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          status: "blocked",
          demoBalance: 12000,
          realBalance: 1000,
          image: "",
        },
      ],
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user?.id === updatedUser.id ? updatedUser : state.user,
          users: state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        })),
      updateUserBalance: (accountType, balance) =>
        set((state) => {
          if (!state.user) return state

          const updatedUser = {
            ...state.user,
            demoBalance: accountType === "demo" ? balance : state.user.demoBalance,
            realBalance: accountType === "real" ? balance : state.user.realBalance,
          }

          return {
            user: updatedUser,
            users: state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
          }
        }),
      deleteUser: (userId) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        })),
    }),
    {
      name: "user-storage",
    },
  ),
)
