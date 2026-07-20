#!/usr/bin/env bash
set -euo pipefail

# --- CONFIGURABLES ---
REPO_SSH="git@github.com:dasodong-byte/COMPUTING.git"
# Branche demandée par vous :
BRANCH="${1:-devin/1784475307-phase2-backend}"
MAIN_BRANCH="main"
WORKDIR="${PWD}/deploy_pack_$(date +%Y%m%d_%H%M%S)"
TMP_CLONE="${WORKDIR}/repo"
CLEAN_DIR="${WORKDIR}/computing-deploy"
ARCHIVE_NAME="${PWD}/computing-deploy_$(date +%F_%H%M%S).tar.gz"

# Safety: migrations off by default. Set APPLY_MIGRATIONS=yes in env to enable.
APPLY_MIGRATIONS="${APPLY_MIGRATIONS:-no}"   # export APPLY_MIGRATIONS=yes to enable
# If APPLY_MIGRATIONS=yes you MUST set PROD_DATABASE_URL (e.g. postgres://user:pass@host:port/db)
APPLY_SEED="${APPLY_SEED:-no}"               # set yes to run seed after migrations (if safe)

# Helper
confirm() {
  read -r -p "$* [y/N] " resp
  case "$resp" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

echo "Préparation d'un dossier propre pour le déploiement depuis la branche : $BRANCH"
echo "Workdir : $WORKDIR"
echo
echo "PRÉ-REQUIS : git, node (>=16), npm, npx, tar, accès Internet."
echo "Si vous activez APPLY_MIGRATIONS, définissez PROD_DATABASE_URL et assurez-vous d'avoir un backup DB."
echo

if ! confirm "Continuer et créer le dossier propre depuis la branche '$BRANCH' ?"; then
  echo "Annulé."
  exit 0
fi

# 1) Create workdir
mkdir -p "$WORKDIR"
echo "Workdir créé : $WORKDIR"

# 2) Shallow clone the requested branch
echo "Clonage de la branche $BRANCH (depth=1) ..."
git clone --depth=1 --branch "$BRANCH" "$REPO_SSH" "$TMP_CLONE"

# 3) Optionally merge latest main into this clone (recommended if main has new changes)
if confirm "Fusionner localement la dernière version de '$MAIN_BRANCH' dans cette copie avant build (recommandé) ?"; then
  pushd "$TMP_CLONE" >/dev/null
  git fetch origin "$MAIN_BRANCH":"origin/$MAIN_BRANCH"
  echo "Merging origin/$MAIN_BRANCH into $BRANCH..."
  git merge --no-ff "origin/$MAIN_BRANCH" -m "Merge origin/$MAIN_BRANCH into $BRANCH for deploy packaging" || {
    echo "Conflit détecté lors du merge. Résolvez manuellement dans $TMP_CLONE puis relancez le script."
    popd >/dev/null
    exit 2
  }
  popd >/dev/null
fi

# 4) Install & production build
echo "Installation des dépendances et build (peut prendre du temps)..."
pushd "$TMP_CLONE" >/dev/null
rm -rf node_modules

npm ci --silent --no-audit --no-fund

if confirm "Exécuter lint et typecheck avant build ?"; then
  npm run lint || echo "Lint a échoué (continuer quand même)"
  npm run typecheck || echo "Typecheck a échoué (continuer quand même)"
fi

echo "npm run build"
npm run build

# 5) Prisma client generate (si présent)
if [ -f "prisma/schema.prisma" ] || [ -d "prisma" ]; then
  echo "Prisma détecté — exécution de npx prisma generate"
  npx prisma generate || echo "prisma generate a échoué (vérifiez les vars d'environnement)"
fi

# 6) Optional: apply migrations (OFF by default)
if [ "${APPLY_MIGRATIONS,,}" = "yes" ]; then
  if [ -z "${PROD_DATABASE_URL:-}" ]; then
    echo "ERREUR: PROD_DATABASE_URL non défini. Annulation des migrations."
    exit 3
  fi
  echo "APPLY_MIGRATIONS=yes : exécution des migrations prisma (prisma migrate deploy)"
  export DATABASE_URL="$PROD_DATABASE_URL"
  npx prisma migrate deploy
  if [ "${APPLY_SEED,,}" = "yes" ]; then
    echo "APPLY_SEED=yes : exécution du seed"
    npm run seed || npx ts-node prisma/seed.ts || echo "Seed échouée ou non définie — vérifiez le script de seed."
  fi
fi

popd >/dev/null

# 7) Prepare clean directory by rsync
echo "Préparation du dossier propre $CLEAN_DIR ..."
mkdir -p "$CLEAN_DIR"
rsync -a --delete --exclude='.git' --exclude='node_modules' --exclude='.github' --exclude='tests' --exclude='**/*.test.*' "$TMP_CLONE"/ "$CLEAN_DIR"/

# 8) Optionally install production-only node_modules into clean dir
if confirm "Installer les dépendances production dans le dossier propre (npm ci --production) ?"; then
  pushd "$CLEAN_DIR" >/dev/null
  npm ci --production --silent --no-audit --no-fund
  popd >/dev/null
fi

# 9) Sanitize env: create .env.example from .env if present
echo "Sanitisation des fichiers d'environnement..."
if [ ! -f "$CLEAN_DIR/.env.example" ] && [ -f "$CLEAN_DIR/.env" ]; then
  cp "$CLEAN_DIR/.env" "$CLEAN_DIR/.env.example"
  # best-effort sanitize common keys
  sed -i -E 's/(DATABASE_URL|PROD_DATABASE_URL|JWT_SECRET|STRIPE_.*)=.*/\1=REPLACE_ME/g' "$CLEAN_DIR/.env.example" || true
fi
rm -rf "$CLEAN_DIR/.git" "$CLEAN_DIR/.github" || true

# 10) Archive
echo "Création de l'archive $ARCHIVE_NAME ..."
tar -czf "$ARCHIVE_NAME" -C "$WORKDIR" "$(basename "$CLEAN_DIR")"

echo "Archive prête : $ARCHIVE_NAME"
echo "Dossier temporaire conservé : $WORKDIR (supprimez-le si vous n'en avez plus besoin)."

echo
echo "IMPORTANT:"
echo "- L'archive contient l'application buildée. Si vous avez choisi d'installer les dépendances production, elles sont incluses."
echo "- Les migrations DB ne sont appliquées que si vous avez explicitement réglé APPLY_MIGRATIONS=yes et fourni PROD_DATABASE_URL."
echo "- Vérifiez .env.example et ajoutez les variables de production sur votre serveur de déploiement."
echo
echo "Terminé."
