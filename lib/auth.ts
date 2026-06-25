import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export type { User };

/* ─────────────────────────────────────────────────────────────────
   HELPERS INTERNES
───────────────────────────────────────────────────────────────── */

/**
 * Convertit un numéro de téléphone en adresse email synthétique.
 * Permet l'authentification par téléphone sans OTP/SMS.
 * Ex : "6 77 12 34 56" → "tel_677123456@nyosi.app"
 */
function emailSynthetique(telephone: string): string {
  const clean = telephone.replace(/[\s\-+()\./]/g, "");
  return `tel_${clean}@nyosi.app`;
}

/**
 * Accepte un téléphone OU un email, retourne toujours un email valide.
 * Règle : si ça commence par un chiffre ou un "+", c'est un téléphone.
 */
function identifiantVersEmail(identifiant: string): string {
  const trim = identifiant.trim();
  if (/^[+\d][\d\s\-\(\)\.]{4,}$/.test(trim)) {
    return emailSynthetique(trim);
  }
  return trim;
}

/** Traduit les messages d'erreur Supabase en français compréhensible */
function traduireErreur(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "Identifiant ou mot de passe incorrect.";
  if (msg.includes("User already registered"))
    return "Ce compte existe déjà. Connecte-toi.";
  if (msg.includes("Password should be at least"))
    return "Le mot de passe doit contenir au moins 6 caractères.";
  if (msg.includes("Email not confirmed"))
    return "Confirme ton adresse email avant de te connecter.";
  if (msg.includes("over_email_send_rate_limit"))
    return "Trop de tentatives. Attends quelques minutes.";
  if (msg.includes("Email rate limit exceeded"))
    return "Trop de tentatives. Attends quelques minutes.";
  return "Une erreur s'est produite. Réessaie.";
}

/* ─────────────────────────────────────────────────────────────────
   API PUBLIQUE
───────────────────────────────────────────────────────────────── */

/**
 * Crée un compte commerçant.
 * Si email vide, génère un email synthétique à partir du téléphone.
 */
export async function inscrire(
  nomComplet: string,
  telephone: string,
  email: string,
  motDePasse: string
): Promise<{ erreur: string | null }> {
  if (!supabase) return { erreur: "Service d'authentification non disponible." };

  const authEmail = email.trim() ? email.trim() : emailSynthetique(telephone);

  const { error } = await supabase.auth.signUp({
    email: authEmail,
    password: motDePasse,
    options: {
      data: { nom_complet: nomComplet, telephone },
    },
  });

  if (error) return { erreur: traduireErreur(error.message) };
  return { erreur: null };
}

/**
 * Connecte un commerçant avec son téléphone ou son email + mot de passe.
 */
export async function connecter(
  identifiant: string,
  motDePasse: string
): Promise<{ erreur: string | null }> {
  if (!supabase) return { erreur: "Service d'authentification non disponible." };

  const email = identifiantVersEmail(identifiant);

  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });

  if (error) return { erreur: traduireErreur(error.message) };
  return { erreur: null };
}

/** Déconnecte l'utilisateur courant. */
export async function deconnecter(): Promise<void> {
  await supabase?.auth.signOut();
}

/** Retourne l'utilisateur connecté, ou null. */
export async function getUtilisateur(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Retourne la session active, ou null. */
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

/**
 * Écoute les changements d'authentification.
 * Retourne une fonction pour arrêter l'écoute (à appeler dans useEffect cleanup).
 */
export function ecouterAuth(callback: (user: User | null) => void): () => void {
  if (!supabase) return () => {};
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}
