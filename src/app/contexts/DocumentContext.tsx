import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ArchiveNumber {
  id: string;
  code: string;
  description: string;
  createdBy: string;
}

export interface Document {
  id: string;
  title: string;
  archiveNumber: string;
  unitKerja: string;
  category: 'kontrak' | 'laporan' | 'undangan' | 'peraturan' | 'surat keluar' | 'surat masuk';
  description?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  retentionDate: string;
  status: 'uploaded' | 'pending';
  uploadedBy: string;
}

interface DocumentContextType {
  documents: Document[];
  archiveNumbers: ArchiveNumber[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'retentionDate'>) => void;
  addArchiveNumber: (archiveNumber: Omit<ArchiveNumber, 'id'>) => void;
  deleteDocument: (id: string) => void;
  getActiveDocuments: () => Document[];
  getExpiredDocuments: () => Document[];
  getDocumentsByUnit: (unitKerja: string) => Document[];
  searchDocuments: (query: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [archiveNumbers, setArchiveNumbers] = useState<ArchiveNumber[]>([]);

  useEffect(() => {
    const storedDocs = localStorage.getItem('podarsip_documents');
    const storedArchive = localStorage.getItem('podarsip_archive_numbers');

    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
    if (storedArchive) {
      setArchiveNumbers(JSON.parse(storedArchive));
    }
  }, []);

  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt' | 'retentionDate'>) => {
    const now = new Date();
    const retentionDate = new Date(now);
    retentionDate.setFullYear(retentionDate.getFullYear() + 1);

    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      uploadedAt: now.toISOString(),
      retentionDate: retentionDate.toISOString(),
    };

    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    localStorage.setItem('podarsip_documents', JSON.stringify(updatedDocs));
  };

  const addArchiveNumber = (archiveNumber: Omit<ArchiveNumber, 'id'>) => {
    const newArchiveNumber: ArchiveNumber = {
      ...archiveNumber,
      id: Date.now().toString(),
    };

    const updatedArchive = [...archiveNumbers, newArchiveNumber];
    setArchiveNumbers(updatedArchive);
    localStorage.setItem('podarsip_archive_numbers', JSON.stringify(updatedArchive));
  };

  const deleteDocument = (id: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem('podarsip_documents', JSON.stringify(updatedDocs));
  };

  const getActiveDocuments = () => {
    const now = new Date();
    return documents.filter(doc => new Date(doc.retentionDate) > now);
  };

  const getExpiredDocuments = () => {
    const now = new Date();
    return documents.filter(doc => new Date(doc.retentionDate) <= now);
  };

  const getDocumentsByUnit = (unitKerja: string) => {
    return documents.filter(doc => doc.unitKerja === unitKerja);
  };

  const searchDocuments = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.archiveNumber.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery) ||
      doc.unitKerja.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      archiveNumbers,
      addDocument,
      addArchiveNumber,
      deleteDocument,
      getActiveDocuments,
      getExpiredDocuments,
      getDocumentsByUnit,
      searchDocuments,
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
