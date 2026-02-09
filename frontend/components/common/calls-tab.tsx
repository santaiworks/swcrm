'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Phone } from "lucide-react"
import { CallForm } from "@/app/dashboard/calls/call-form"
import { format } from "date-fns"
import { toast } from "sonner"

interface CallsTabProps {
  entityType: string
  entityId: string
}

export function CallsTab({ entityType, entityId }: CallsTabProps) {
  const [calls, setCalls] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const url = `${base}/calls/?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = res.ok ? await res.json() : []
      setCalls(Array.isArray(data) ? data : [])
    } catch {
      setCalls([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [entityType, entityId])

  const handleDelete = async (id: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/calls/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success("Call deleted")
      load()
    } catch {
      toast.error("Failed to delete call")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">Calls</span>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>Log a call</Button>
      </div>

      {calls.length === 0 && !loading ? (
        <Card>
          <CardContent className="py-6 text-center text-sm text-gray-500">
            No calls yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {calls.map((c) => (
            <Card key={c.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.subject}</span>
                    <span className="text-xs text-gray-500">{c.status}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.duration_seconds ? `${c.duration_seconds}s` : c.duration || '0s'} • {format(new Date(c.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                  {c.notes ? <div className="text-xs text-gray-600">{c.notes}</div> : null}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CallForm
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) load()
        }}
        entityType={entityType}
        entityId={entityId}
        onSuccess={load}
      />
    </div>
  )
}
