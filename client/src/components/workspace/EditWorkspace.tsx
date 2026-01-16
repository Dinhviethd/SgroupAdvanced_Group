import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWorkspaceById, updateWorkspace } from '@/service/workspaceService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const TIERS = ['FREE', 'PRO', 'BUSINESS']
const STATUSES = ['PUBLIC', 'PRIVATE']

export function EditWorkspace() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    tier: 'FREE',
    status: 'PRIVATE',
    avatarUrl: '',
  })

  useEffect(() => {
    if (!id) return
    fetchWorkspace()
  }, [id])

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      const workspace = await getWorkspaceById(parseInt(id!))
      setFormData({
        name: workspace.name,
        tier: workspace.tier || 'FREE',
        status: workspace.status || 'PRIVATE',
        avatarUrl: workspace.avatarUrl || '',
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải workspace')
      toast.error('Lỗi khi tải workspace')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên workspace')
      return
    }

    setSaving(true)
    try {
      await updateWorkspace(parseInt(id!), formData)
      toast.success('Cập nhật workspace thành công!')
      navigate(`/workspace/${id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật workspace')
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => navigate('/')} variant="outline">
          Quay về trang chủ
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chỉnh sửa Workspace</CardTitle>
          <CardDescription>
            Cập nhật thông tin workspace của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Workspace</Label>
              <Input
                id="name"
                placeholder="Nhập tên workspace..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Gói dịch vụ</Label>
              <select
                id="tier"
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                disabled={saving}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={saving}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">URL hình ảnh</Label>
              <Input
                id="avatarUrl"
                placeholder="https://..."
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/workspace/${id}`)}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
