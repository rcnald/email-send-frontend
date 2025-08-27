import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ClientsTable } from "@/components/clients-table"
import { useFileStore } from "@/store/file-store"

export const SelectClientStep = () => {
  const navigate = useNavigate()
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  useEffect(() => {
    if (!hasFilesToProceed) {
      navigate("/upload", { replace: true })
    }
  }, [hasFilesToProceed, navigate])

  return <ClientsTable />
}
