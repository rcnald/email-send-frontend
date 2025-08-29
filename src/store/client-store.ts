import { create } from "zustand"

export type Client = {
  id: string
}

export interface ClientStore {
  clients: Client[]
  actions: {
    addClient: (client: Client) => void
    removeClient: (id: string) => void
  }
}
