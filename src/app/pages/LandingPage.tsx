import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="size-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">PODARSIP</CardTitle>
            <CardDescription className="text-base">
              Pohkecik Digital Arsip
            </CardDescription>
            <p className="text-sm text-muted-foreground">
              Kantor Desa Pohkecik
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/signin" className="block">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <Link to="/signup" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
