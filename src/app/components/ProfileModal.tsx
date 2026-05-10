import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UNIT_KERJA_OPTIONS } from '../lib/utils';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [nip, setNip] = useState(user?.nip || '');
  const [unitKerja, setUnitKerja] = useState(user?.unitKerja || '');
  const [photo, setPhoto] = useState(user?.photo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({
      name,
      nip: nip || undefined,
      unitKerja,
      photo: photo || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Edit informasi profile Anda
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="size-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="size-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <Camera className="size-8 text-muted-foreground" />
                </div>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full size-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="size-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-name">Nama Lengkap</Label>
            <Input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-nip">NIP (Opsional)</Label>
            <Input
              id="profile-nip"
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-unit">Unit Kerja</Label>
            <Select value={unitKerja} onValueChange={setUnitKerja}>
              <SelectTrigger id="profile-unit">
                <SelectValue placeholder="Pilih unit kerja" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_KERJA_OPTIONS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
