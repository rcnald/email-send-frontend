import { Settings } from "lucide-react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
// Assuming you have Avatar components
import { Badge } from "@/components/ui/badge" // Assuming you have a Badge component
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card"
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

// User data
const users = [
  {
    id: "1",
    name: "Kathryn Campbell",
    availability: "online",
    avatar: "1.png",
    status: "active",
    email: "kathryn@apple.com",
  },
  {
    id: "2",
    name: "Robert Smith",
    availability: "away",
    avatar: "2.png",
    status: "inactive",
    email: "robert@openai.com",
  },
  {
    id: "3",
    name: "Sophia Johnson",
    availability: "busy",
    avatar: "3.png",
    status: "active",
    email: "sophia@meta.com",
  },
  {
    id: "4",
    name: "Lucas Walker",
    availability: "offline",
    avatar: "4.png",
    status: "inactive",
    flag: "🇦🇺",
    email: "lucas@tesla.com",
  },
  {
    id: "5",
    name: "Emily Davis",
    availability: "online",
    avatar: "5.png",
    status: "active",
    email: "emily@sap.com",
  },
]

export const ResumeStep = () => {
  const navigate = useNavigate()
  const hasSelectedClient = useClientStore((state) => Boolean(state.client))
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  useEffect(() => {
    if (!(hasFilesToProceed && hasSelectedClient)) {
      navigate(-1)
    }
  }, [hasFilesToProceed, hasSelectedClient, navigate])

  return (
    <Card className='w-[400px]'>
      <CardHeader>
        <CardHeading>
          <CardTitle>Recent Users</CardTitle>
        </CardHeading>
        <CardToolbar>
          <Button size='icon' variant='outline'>
            <Settings />
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardContent className='py-1'>
        {users.map((user) => {
          return (
            <div
              className='flex items-center justify-between gap-2 border-b border-dashed py-2 last:border-none'
              key={user.id}
            >
              {/* Right: Status Badge */}
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
          )
        })}
      </CardContent>
      <CardFooter className='justify-center'>
        <Button variant='link'>
          <Link to='#'>Learn more</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
