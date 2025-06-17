import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "en" | "es";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language = "en",
}) => {
  const { signUp, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const translations = {
    en: {
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      signInButton: "Sign In",
      signUpButton: "Create Account",
      signInDescription: "Enter your credentials to access your account",
      signUpDescription: "Create a new account to get started",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      signUpSuccess:
        "Account created successfully! Please check your email to verify your account.",
      signInSuccess: "Welcome back!",
    },
    es: {
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      email: "Correo Electrónico",
      password: "Contraseña",
      signInButton: "Iniciar Sesión",
      signUpButton: "Crear Cuenta",
      signInDescription: "Ingresa tus credenciales para acceder a tu cuenta",
      signUpDescription: "Crea una nueva cuenta para comenzar",
      emailPlaceholder: "Ingresa tu correo electrónico",
      passwordPlaceholder: "Ingresa tu contraseña",
      signUpSuccess:
        "¡Cuenta creada exitosamente! Por favor revisa tu correo para verificar tu cuenta.",
      signInSuccess: "¡Bienvenido de vuelta!",
    },
  };

  const t = translations[language];

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(t.signInSuccess);
      setTimeout(() => {
        onClose();
      }, 1000);
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(t.signUpSuccess);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>TradeNavigatorPro</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
            <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <DialogDescription>{t.signInDescription}</DialogDescription>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{t.email}</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">{t.password}</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.signInButton}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <DialogDescription>{t.signUpDescription}</DialogDescription>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t.email}</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">{t.password}</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.signUpButton}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
