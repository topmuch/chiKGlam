'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useStore } from '@/store/use-store';
import { toast } from 'sonner';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'register';
}

export default function LoginDialog({ open, onOpenChange, defaultMode = 'login' }: LoginDialogProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(defaultMode);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const setUser = useStore((s) => s.setUser);

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthPhone('');
    setAuthError('');
  };

  const handleAuth = async () => {
    setAuthError('');
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('E-mail et mot de passe requis.');
      return;
    }
    if (authMode === 'register' && !authName.trim()) {
      setAuthError('Nom complet requis.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          email: authEmail,
          password: authPassword,
          name: authName || undefined,
          phone: authPhone || undefined,
        }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          avatar: data.user.avatar,
          phone: data.user.phone,
          isActive: data.user.isActive,
          createdAt: data.user.createdAt,
        });
        onOpenChange(false);
        resetAuthForm();

        if (authMode === 'login') {
          toast.success(`Bienvenue${data.user.name ? ', ' + data.user.name : ''} !`, {
            description: 'Vous êtes connecté à votre compte.',
          });
        } else {
          toast.success('Compte créé avec succès !', {
            description: 'Bienvenue dans la famille Chic Glam by Eva.',
          });
        }
      } else {
        setAuthError(data.error || "Échec de l'authentification.");
      }
    } catch {
      setAuthError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setAuthLoading(false);
    }
  };

  const switchAuthMode = () => {
    resetAuthForm();
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  // Sync mode when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      resetAuthForm();
      setAuthMode(defaultMode);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {authMode === 'login' ? 'Bon Retour' : 'Créer un Compte'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {authMode === 'login'
              ? 'Connectez-vous à votre compte pour continuer'
              : 'Rejoignez-nous pour des offres exclusives et le suivi de commandes'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {authError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {authError}
            </div>
          )}

          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Nom Complet</Label>
              <Input
                id="auth-name"
                placeholder="Marie Dupont"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auth-email">E-mail</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="marie@exemple.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>

          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="auth-phone">Téléphone</Label>
              <Input
                id="auth-phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={authPhone}
                onChange={(e) => setAuthPhone(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auth-password">Mot de passe</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAuth();
              }}
            />
          </div>

          <Button
            onClick={handleAuth}
            disabled={authLoading}
            className="w-full bg-luxury text-luxury-foreground hover:bg-luxury/90 rounded-full h-11 font-semibold"
          >
            {authLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {authMode === 'login' ? 'Connexion...' : 'Création...'}
              </>
            ) : authMode === 'login' ? (
              'Se Connecter'
            ) : (
              'Créer le Compte'
            )}
          </Button>

          <div className="text-center">
            <button
              onClick={switchAuthMode}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {authMode === 'login'
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
