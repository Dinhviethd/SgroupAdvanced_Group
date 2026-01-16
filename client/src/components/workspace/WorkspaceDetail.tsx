import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorkspaceById, updateWorkspace, type Workspace } from '@/service/workspaceService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Edit2, Settings, Users, Plus } from 'lucide-react'

export function WorkspaceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const data = await getWorkspaceById(parseInt(id))
        setWorkspace(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải workspace')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspace()
  }, [id])

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">{error}</p>
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
        >
          Quay về trang chủ
        </Button>
      </div>
    )
  }

  if (!workspace) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{workspace.name}</h1>
            <p className="text-muted-foreground mt-1">
              Tạo bởi {workspace.createdBy?.name || 'Unknown'}
            </p>
            <div className="flex gap-2 mt-3">
              <Badge>{workspace.tier}</Badge>
              <Badge variant={workspace.status === 'PUBLIC' ? 'default' : 'secondary'}>
                {workspace.status === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
              </Badge>
              <Badge variant="outline">
                {new Date(workspace.createdAt).toLocaleDateString('vi-VN')}
              </Badge>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/workspace/${id}/edit`)}
          variant="outline"
          className="gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Chưa có thành viên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Chưa có board nào</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Gói dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{workspace.tier}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {workspace.tier === 'FREE' ? 'Miễn phí' : workspace.tier === 'PRO' ? 'Chuyên nghiệp' : 'Doanh nghiệp'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Boards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Boards</h2>
          <Button className="gap-2" size="sm">
            <Plus className="w-4 h-4" />
            Tạo Board
          </Button>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có board nào trong workspace này</p>
            <Button variant="outline">
              Tạo board đầu tiên
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Thành viên</h2>
          <Button className="gap-2" size="sm">
            <Plus className="w-4 h-4" />
            Thêm thành viên
          </Button>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có thành viên nào</p>
            <Button variant="outline">
              Mời thành viên
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
