import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  LogOut,
  Upload,
  FileText,
  Building2,
  Archive,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UNIT_KERJA_OPTIONS } from '../lib/utils';
import ProfileModal from '../components/ProfileModal';
import UploadDocumentModal from '../components/UploadDocumentModal';
import ArchiveNumberModal from '../components/ArchiveNumberModal';
import DocumentTable from '../components/DocumentTable';

type View = 'overview' | 'upload' | 'archive-numbers' | 'unit-kerja' | 'active' | 'expired';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { documents, getActiveDocuments, getExpiredDocuments, searchDocuments } = useDocuments();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeDocuments = getActiveDocuments();
  const expiredDocuments = getExpiredDocuments();

  const getDisplayedDocuments = () => {
    if (searchQuery) {
      return searchDocuments(searchQuery);
    }

    switch (currentView) {
      case 'active':
        return activeDocuments;
      case 'expired':
        return expiredDocuments;
      case 'unit-kerja':
        return selectedUnit ? documents.filter(doc => doc.unitKerja === selectedUnit) : documents;
      default:
        return documents;
    }
  };

  const displayedDocuments = getDisplayedDocuments();

  const unitStats = UNIT_KERJA_OPTIONS.map(unit => ({
    name: unit,
    count: documents.filter(doc => doc.unitKerja === unit).length
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <Building2 className="size-6 text-primary" />
            <h1 className="font-semibold text-lg">PODARSIP</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileModal(true)}
              className="relative"
            >
              {user?.photo ? (
                <img src={user.photo} alt="Profile" className="size-8 rounded-full object-cover" />
              ) : (
                <User className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 border-r bg-card min-h-[calc(100vh-73px)] fixed md:sticky top-[73px] z-40`}>
          <nav className="p-4 space-y-2">
            <Button
              variant={currentView === 'overview' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('overview');
                setMobileMenuOpen(false);
              }}
            >
              <FileText className="size-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={currentView === 'upload' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('upload');
                setShowUploadModal(true);
                setMobileMenuOpen(false);
              }}
            >
              <Upload className="size-4 mr-2" />
              Unggah Dokumen
            </Button>
            <Button
              variant={currentView === 'archive-numbers' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('archive-numbers');
                setShowArchiveModal(true);
                setMobileMenuOpen(false);
              }}
            >
              <Archive className="size-4 mr-2" />
              Nomor Arsip
            </Button>
            <Button
              variant={currentView === 'active' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('active');
                setMobileMenuOpen(false);
              }}
            >
              <FileText className="size-4 mr-2" />
              File Aktif
            </Button>
            <Button
              variant={currentView === 'expired' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('expired');
                setMobileMenuOpen(false);
              }}
            >
              <Clock className="size-4 mr-2" />
              File Kadaluarsa
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-3">UNIT KERJA</p>
              {UNIT_KERJA_OPTIONS.map((unit) => (
                <Button
                  key={unit}
                  variant={currentView === 'unit-kerja' && selectedUnit === unit ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setCurrentView('unit-kerja');
                    setSelectedUnit(unit);
                    setMobileMenuOpen(false);
                  }}
                >
                  {unit}
                </Button>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl">
          {currentView === 'overview' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
                <p className="text-muted-foreground">
                  Selamat datang, {user?.name}
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardDescription>Total Dokumen</CardDescription>
                    <CardTitle className="text-3xl">{documents.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>File Aktif</CardDescription>
                    <CardTitle className="text-3xl">{activeDocuments.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>File Kadaluarsa</CardDescription>
                    <CardTitle className="text-3xl">{expiredDocuments.length}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Unit Kerja Stats */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Ruang Per-Unit Kerja</CardTitle>
                  <CardDescription>Jumlah dokumen per unit kerja</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {unitStats.map((stat) => (
                      <div
                        key={stat.name}
                        className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setCurrentView('unit-kerja');
                          setSelectedUnit(stat.name);
                        }}
                      >
                        <span className="text-sm">{stat.name}</span>
                        <span className="font-semibold">{stat.count} dokumen</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Dokumen Terbaru</CardTitle>
                  <CardDescription>Aktivitas upload terbaru</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentTable documents={documents.slice(0, 5)} />
                </CardContent>
              </Card>
            </>
          )}

          {(currentView === 'active' || currentView === 'expired' || currentView === 'unit-kerja' || searchQuery) && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-1">
                  {currentView === 'active' && 'File Aktif'}
                  {currentView === 'expired' && 'File Kadaluarsa'}
                  {currentView === 'unit-kerja' && selectedUnit}
                  {searchQuery && `Hasil Pencarian: "${searchQuery}"`}
                </h2>
                <p className="text-muted-foreground">
                  {displayedDocuments.length} dokumen
                </p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <DocumentTable documents={displayedDocuments} />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <UploadDocumentModal open={showUploadModal} onOpenChange={setShowUploadModal} />
      <ArchiveNumberModal open={showArchiveModal} onOpenChange={setShowArchiveModal} />
    </div>
  );
}
