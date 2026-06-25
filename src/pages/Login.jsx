import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Eye,
  EyeOff,
  LayoutGrid,
  LogIn,
  MessageSquare,
  Package,
  Receipt,
  Route,
  Sparkles,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  APP_HERO_HEADLINE,
  APP_LEAD_PRIMARY,
  APP_LOGO_URL,
  APP_LOGIN_FEATURE_LABELS,
  APP_NAME,
  APP_TAGLINE_SHORT,
  APP_VALUE_CHIPS,
} from "@/config/branding";
import { COMMERCIAL_SUPPORT_EMAIL, COMMERCIAL_WEB_URL } from "@/config/commercial";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Ordre aligné avec `APP_LOGIN_FEATURE_LABELS` dans `@/config/branding`. */
const LOGIN_FEATURE_ICONS = [
  Activity,
  MessageSquare,
  AlertTriangle,
  Wrench,
  BarChart3,
  Users,
  Sparkles,
  Route,
  Truck,
  Package,
  LayoutGrid,
  Receipt,
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    login({ email, password })
      .then(() => navigate("/", { replace: true }))
      .catch((error) =>
        setError(
          error?.message === "Invalid password"
            ? "Mot de passe incorrect."
            : "Compte introuvable. Demandez à l’administrateur de créer votre accès."
        )
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://thumbs.dreamstime.com/b/global-business-logistics-import-export-background-container-cargo-freight-ship-transport-concept-137520514.jpg"
          alt="Transport multimodal logistique"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 min-h-screen px-6 py-12 lg:px-20 xl:px-28 flex items-center">
        <div className="mx-auto w-full max-w-none">
          <div className="grid gap-12 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full lg:order-2"
            >
              <Card className="h-full border border-white/15 bg-white/12 text-slate-100 shadow-2xl shadow-slate-900/40 backdrop-blur-2xl">
                <CardHeader className="space-y-2 px-8 pt-8">
                  <CardTitle className="text-2xl text-white">Connexion</CardTitle>
                  <p className="text-sm text-slate-300">
                    Accède à ton espace {APP_NAME} : flotte, missions, CRM, facturation et
                    indicateurs commerciaux.
                  </p>
                </CardHeader>
                <CardContent className="flex h-full flex-col justify-between gap-6 px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="iksatech@iksatech.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-sky-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-200">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-sky-400 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-sky-400 focus:ring-sky-400"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                        />
                        Se souvenir de moi
                      </label>
                      <button
                        type="button"
                        className="text-sky-300 hover:text-sky-200"
                        onClick={() => setError("Veuillez contacter l’administrateur pour réinitialiser votre mot de passe.")}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-red-200 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="h-11 w-full bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-900 hover:from-sky-400 hover:to-emerald-300"
                      disabled={isSubmitting}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                    Support dédié aux équipes exploitation, chauffeurs, relation client et
                    facturation.
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto space-y-6 text-center lg:text-left lg:order-1 lg:mx-0 lg:max-w-3xl"
            >
              <div className="mx-auto flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:justify-start lg:mx-0">
                <div className="rounded-2xl bg-white p-3 shadow-lg shadow-sky-500/25 ring-1 ring-white/20">
                  <img
                    src={APP_LOGO_URL}
                    alt={`Logo ${APP_NAME}`}
                    className="h-12 sm:h-14 w-auto max-w-[min(100%,18rem)] object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-semibold text-white">{APP_NAME}</p>
                  <p className="text-sm text-sky-200/90">{APP_TAGLINE_SHORT}</p>
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                {APP_HERO_HEADLINE}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
                {APP_LEAD_PRIMARY}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-200 lg:justify-start">
                {APP_VALUE_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/15 bg-white/12 px-3 py-1 backdrop-blur"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/12 p-6 text-left text-sm text-slate-200 backdrop-blur">
                <p className="text-sm font-semibold text-white">Fonctionnalités clés</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {APP_LOGIN_FEATURE_LABELS.map((label, i) => {
                    const Icon = LOGIN_FEATURE_ICONS[i] ?? Activity;
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-slate-100">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href={COMMERCIAL_WEB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-gradient-to-r from-sky-500 to-emerald-400 px-6 text-sm font-medium text-slate-900 transition-colors hover:from-sky-400 hover:to-emerald-300"
                >
                  Contact &amp; déploiement
                </a>
                <a
                  href={`mailto:${COMMERCIAL_SUPPORT_EMAIL}`}
                  className="text-sm text-slate-200 underline underline-offset-4 hover:text-white"
                >
                  {COMMERCIAL_SUPPORT_EMAIL}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

