import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '@/service/profileService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

export function DeleteAccountForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      toast.error('Vui lòng nhập mật khẩu')
      return
    }

    if (!confirmed) {
      toast.error('Vui lòng xác nhận xóa tài khoản')
      return
    }

    // Show confirmation dialog
    if (!window.confirm('Bạn chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      return
    }

    setLoading(true)
    try {
      await profileService.deleteAccount(password)
      toast.success('Tài khoản đã được xóa')
      navigate('/auth/login')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa tài khoản')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Xóa tài khoản
          </CardTitle>
          <CardDescription>
            Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu liên quan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive font-semibold">
                ⚠️ Cảnh báo: Sau khi xóa, bạn sẽ không thể khôi phục dữ liệu này
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Xác nhận bằng mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  Tôi hiểu rằng hành động này không thể hoàn tác
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/profile')}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={loading || !confirmed || !password}
              >
                {loading ? 'Đang xóa...' : 'Xóa tài khoản'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
