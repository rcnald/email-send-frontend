import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type Client = {
  id: string
}

export interface ClientStore {
  client: Client | undefined
  actions: {
    addClient: (client: Client) => void
    clearClient: () => void
  }
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      client: undefined,
      actions: {
        addClient: (client: Client) =>
          set(() => ({
            client,
          })),
        clearClient: () => set(() => ({ client: undefined })),
      },
    }),
    {
      name: "@email-send-1.0:client-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        client: state.client,
      }),
    }
  )
)
