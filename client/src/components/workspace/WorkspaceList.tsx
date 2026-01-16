import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyWorkspaces, deleteWorkspace, type Workspace } from '@/service/workspaceService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { MoreVertical, Trash2, Edit2, Plus } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

export function WorkspaceList() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      setLoading(true)
      const data = await getMyWorkspaces()
      setWorkspaces(data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách workspace')
      toast.error('Lỗi khi tải workspace')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa workspace này?')) return

    setDeleting(id)
    try {
      await deleteWorkspace(id)
      setWorkspaces(workspaces.filter(w => w.idWorkspace !== id))
      toast.success('Đã xóa workspace')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa workspace')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/workspace/${id}/edit`)
  }

  if (error && workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchWorkspaces} variant="outline">
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground mt-1">Quản lý các workspace của bạn</p>
        </div>
        <Button onClick={() => navigate('/workspace/create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo Workspace
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có workspace nào</p>
            <Button onClick={() => navigate('/workspace/create')}>
              Tạo workspace đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.idWorkspace}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/workspace/${workspace.idWorkspace}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mb-3">
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <CardTitle className="truncate">{workspace.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {workspace.createdBy?.name}
                    </CardDescription>
                  </div>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(workspace.idWorkspace)
                      }}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(workspace.idWorkspace)
                        }}
                        disabled={deleting === workspace.idWorkspace}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tier:</span>
                  <span className="font-medium capitalize">{workspace.tier}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workspace.status === 'PUBLIC'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workspace.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Tạo: {new Date(workspace.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
