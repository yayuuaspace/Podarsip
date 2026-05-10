import { ExternalLink, FileText } from 'lucide-react';
import { Document } from '../contexts/DocumentContext';
import { formatDate } from '../lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface DocumentTableProps {
  documents: Document[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const handleOpenDocument = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName;
    link.click();
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="size-12 mx-auto mb-3 opacity-50" />
        <p>Belum ada dokumen</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Nomor Arsip</TableHead>
            <TableHead className="hidden md:table-cell">Kategori</TableHead>
            <TableHead className="hidden lg:table-cell">Unit Kerja</TableHead>
            <TableHead className="hidden md:table-cell">Masa Retensi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.title}</TableCell>
              <TableCell>{doc.archiveNumber}</TableCell>
              <TableCell className="hidden md:table-cell capitalize">{doc.category}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm">{doc.unitKerja}</TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {formatDate(doc.retentionDate)}
              </TableCell>
              <TableCell>
                <Badge variant={doc.status === 'uploaded' ? 'default' : 'secondary'}>
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDocument(doc)}
                >
                  <ExternalLink className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
