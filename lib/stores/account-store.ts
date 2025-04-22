import { create } from "zustand"
import { persist } from "zustand/middleware"

type AccountType = "demo" | "real"

interface AccountState {
  accountType: AccountType
  toggleAccountType: () => void
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accountType: "demo",
      toggleAccountType: () => set((state) => ({ accountType: state.accountType === "demo" ? "real" : "demo" })),
    }),
    {
      name: "account-storage",
    },
  ),
)
