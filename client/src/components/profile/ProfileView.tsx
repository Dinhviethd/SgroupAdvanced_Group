import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/authStore'
import { profileService } from '@/service/profileService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Camera, Mail, Phone, User } from 'lucide-react'

export function ProfileView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Tên không được để trống')
      return
    }

    setLoading(true)
    try {
      await profileService.updateProfile(formData)
      toast.success('Cập nhật profile thành công!')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Skeleton className="h-96 w-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold relative group cursor-pointer">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Tên</p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm break-all">{user.email}</p>
                  {user.emailVerified && (
                    <span className="text-xs text-green-600">✓ Đã xác minh</span>
                  )}
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Điện thoại</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chỉnh sửa thông tin</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập tên của bạn"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading || !isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading || !isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading || !isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  URL Avatar
                </Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://..."
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  disabled={loading || !isEditing}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          avatarUrl: user.avatarUrl || '',
                        })
                      }}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bảo mật</CardTitle>
            <CardDescription>Quản lý mật khẩu của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/profile/change-password')}
            >
              Thay đổi mật khẩu
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Xóa tài khoản</CardTitle>
            <CardDescription>Hành động này không thể hoàn tác</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => navigate('/profile/delete-account')}
            >
              Xóa tài khoản
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
