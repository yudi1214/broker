import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Transaction } from "../models/types"

interface FinanceState {
  deposits: Transaction[]
  withdrawals: Transaction[]
  addDeposit: (deposit: Transaction) => void
  addWithdrawal: (withdrawal: Transaction) => void
  updateDeposit: (deposit: Transaction) => void
  updateWithdrawal: (withdrawal: Transaction) => void
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      deposits: [
        {
          id: "d1",
          amount: 1000,
          status: "approved",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          accountType: "real",
          method: "pix",
          type: "deposit",
        },
        {
          id: "d2",
          amount: 500,
          status: "pending",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          accountType: "real",
          method: "pix",
          type: "deposit",
        },
      ],
      withdrawals: [
        {
          id: "w1",
          amount: 300,
          status: "approved",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          accountType: "real",
          method: "pix",
          type: "withdrawal",
        },
        {
          id: "w2",
          amount: 200,
          status: "pending",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          accountType: "real",
          method: "pix",
          type: "withdrawal",
        },
      ],
      addDeposit: (deposit) => set((state) => ({ deposits: [deposit, ...state.deposits] })),
      addWithdrawal: (withdrawal) => set((state) => ({ withdrawals: [withdrawal, ...state.withdrawals] })),
      updateDeposit: (updatedDeposit) =>
        set((state) => ({
          deposits: state.deposits.map((deposit) => (deposit.id === updatedDeposit.id ? updatedDeposit : deposit)),
        })),
      updateWithdrawal: (updatedWithdrawal) =>
        set((state) => ({
          withdrawals: state.withdrawals.map((withdrawal) =>
            withdrawal.id === updatedWithdrawal.id ? updatedWithdrawal : withdrawal,
          ),
        })),
    }),
    {
      name: "finance-storage",
    },
  ),
)
