import { authService } from "@/service";
import { useAuth } from "@/store/authStore";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function ViewSettingProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [imgDefaultUrl, setImgDefaultUrl] = useState<string>("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setImgDefaultUrl(user.avatarUrl || "");
    }
  }, [user, open]);

  const handleChosesImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setImgDefaultUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const response = await authService.updateProfile({
        name,
        phone,
        avatar: avatarFile || undefined,
      });
      setUser(response.data);
      toast.success("Cập nhật thành công!");
      setOpen(false);
    } catch (e) {
      toast.error("Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* --- Phần Ảnh Đại Diện --- */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24">
              <img
                src={imgDefaultUrl || "https://github.com/shadcn.png"}
                alt="Avatar Preview"
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <div className="grid w-full max-w-xs items-center gap-1.5">
              <label
                htmlFor="picture"
                className="cursor-pointer px-4 py-2 rounded-md border border-dashed text-sm hover:bg-muted text-center"
              >
                {avatarFile ? "Đổi ảnh khác" : "Chọn ảnh đại diện"}
              </label>

              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleChosesImg}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
