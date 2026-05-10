import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentContext';
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
import { Card, CardContent } from './ui/card';

interface ArchiveNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArchiveNumberModal({ open, onOpenChange }: ArchiveNumberModalProps) {
  const { user } = useAuth();
  const { archiveNumbers, addArchiveNumber } = useDocuments();
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !description) {
      alert('Lengkapi semua field');
      return;
    }

    addArchiveNumber({
      code,
      description,
      createdBy: user?.email || '',
    });

    setCode('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nomor Arsip</DialogTitle>
          <DialogDescription>
            Kelola nomor arsip untuk klasifikasi dokumen
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Add Form */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="archive-code">Kode Nomor Arsip</Label>
                    <Input
                      id="archive-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Contoh: ARS-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="archive-desc">Keterangan</Label>
                    <Input
                      id="archive-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Deskripsi nomor arsip"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="size-4 mr-2" />
                  Tambah Nomor Arsip
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <div className="space-y-3">
            <h4 className="font-medium">Daftar Nomor Arsip ({archiveNumbers.length})</h4>
            {archiveNumbers.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Belum ada nomor arsip. Tambahkan nomor arsip terlebih dahulu.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {archiveNumbers.map((archive) => (
                  <Card key={archive.id}>
                    <CardContent className="pt-6 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{archive.code}</p>
                        <p className="text-sm text-muted-foreground">{archive.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
