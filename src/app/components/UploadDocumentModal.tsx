import { useState, useRef } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
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
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UNIT_KERJA_OPTIONS, CATEGORY_OPTIONS } from '../lib/utils';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadDocumentModal({ open, onOpenChange }: UploadDocumentModalProps) {
  const { user } = useAuth();
  const { addDocument, archiveNumbers } = useDocuments();
  const [title, setTitle] = useState('');
  const [archiveNumber, setArchiveNumber] = useState('');
  const [unitKerja, setUnitKerja] = useState(user?.unitKerja || '');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'uploaded' | 'pending'>('uploaded');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !archiveNumber || !unitKerja || !category) {
      alert('Lengkapi semua field yang wajib');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      addDocument({
        title,
        archiveNumber,
        unitKerja,
        category: category as any,
        description: description || undefined,
        fileName: file.name,
        fileUrl: reader.result as string,
        fileType: file.type,
        status,
        uploadedBy: user?.email || '',
      });

      setTitle('');
      setArchiveNumber('');
      setUnitKerja(user?.unitKerja || '');
      setCategory('');
      setDescription('');
      setFile(null);
      setStatus('uploaded');
      onOpenChange(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unggah Dokumen</DialogTitle>
          <DialogDescription>
            Upload dokumen arsip baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="doc-file">File *</Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadIcon className="size-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk upload file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, XLSX, PNG, JPG, dll
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              id="doc-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-title">Judul Dokumen *</Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama dokumen"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-archive">Nomor Arsip *</Label>
            <Select value={archiveNumber} onValueChange={setArchiveNumber} required>
              <SelectTrigger id="doc-archive">
                <SelectValue placeholder="Pilih nomor arsip" />
              </SelectTrigger>
              <SelectContent>
                {archiveNumbers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Belum ada nomor arsip. Buat di menu Nomor Arsip.
                  </div>
                ) : (
                  archiveNumbers.map((archive) => (
                    <SelectItem key={archive.id} value={archive.code}>
                      {archive.code} - {archive.description}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-unit">Unit Kerja *</Label>
            <Select value={unitKerja} onValueChange={setUnitKerja} required>
              <SelectTrigger id="doc-unit">
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

          <div className="space-y-2">
            <Label htmlFor="doc-category">Kategori Dokumen *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="doc-category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-status">Status *</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)} required>
              <SelectTrigger id="doc-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-description">Deskripsi (Opsional)</Label>
            <Textarea
              id="doc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan tambahan"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
