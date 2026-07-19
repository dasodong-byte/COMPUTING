// Central RBAC definitions — roles, permissions and their mapping.
// Used by the seed (to provision Role/Permission rows) and at runtime
// (to guard API routes and server components).

export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CLIENT: "CLIENT",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: "Administrateur",
  STAFF: "Personnel",
  CLIENT: "Client",
};

// Permission keys follow the "<entity>.<action>" convention.
export const PERMISSIONS = {
  PRODUCT_READ: "product.read",
  PRODUCT_WRITE: "product.write",
  ORDER_READ: "order.read",
  ORDER_READ_ALL: "order.read.all",
  ORDER_WRITE: "order.write",
  ORDER_MANAGE: "order.manage",
  QUOTE_READ: "quote.read",
  QUOTE_READ_ALL: "quote.read.all",
  QUOTE_WRITE: "quote.write",
  QUOTE_MANAGE: "quote.manage",
  PAYMENT_MANAGE: "payment.manage",
  DELIVERY_MANAGE: "delivery.manage",
  CUSTOMER_READ: "customer.read",
  USER_MANAGE: "user.manage",
  SETTING_MANAGE: "setting.manage",
  CONTENT_MANAGE: "content.manage",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const P = PERMISSIONS;

// Permissions granted to each role. ADMIN implicitly has every permission.
export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  ADMIN: Object.values(P),
  STAFF: [
    P.PRODUCT_READ,
    P.PRODUCT_WRITE,
    P.ORDER_READ_ALL,
    P.ORDER_MANAGE,
    P.QUOTE_READ_ALL,
    P.QUOTE_MANAGE,
    P.PAYMENT_MANAGE,
    P.DELIVERY_MANAGE,
    P.CUSTOMER_READ,
    P.CONTENT_MANAGE,
  ],
  CLIENT: [
    P.PRODUCT_READ,
    P.ORDER_READ,
    P.ORDER_WRITE,
    P.QUOTE_READ,
    P.QUOTE_WRITE,
  ],
};

export const PERMISSION_DESCRIPTIONS: Record<PermissionKey, string> = {
  [P.PRODUCT_READ]: "Consulter le catalogue produits",
  [P.PRODUCT_WRITE]: "Créer et modifier des produits",
  [P.ORDER_READ]: "Consulter ses propres commandes",
  [P.ORDER_READ_ALL]: "Consulter toutes les commandes",
  [P.ORDER_WRITE]: "Passer des commandes",
  [P.ORDER_MANAGE]: "Gérer le cycle de vie des commandes",
  [P.QUOTE_READ]: "Consulter ses propres devis",
  [P.QUOTE_READ_ALL]: "Consulter tous les devis",
  [P.QUOTE_WRITE]: "Demander des devis",
  [P.QUOTE_MANAGE]: "Gérer et chiffrer les devis",
  [P.PAYMENT_MANAGE]: "Valider et gérer les paiements",
  [P.DELIVERY_MANAGE]: "Gérer les livraisons",
  [P.CUSTOMER_READ]: "Consulter les clients",
  [P.USER_MANAGE]: "Gérer les utilisateurs et rôles",
  [P.SETTING_MANAGE]: "Configurer la plateforme",
  [P.CONTENT_MANAGE]: "Gérer le contenu (CMS)",
};

export function permissionsForRoles(roles: string[]): Set<PermissionKey> {
  const result = new Set<PermissionKey>();
  for (const role of roles) {
    const perms = ROLE_PERMISSIONS[role as RoleName];
    if (perms) perms.forEach((p) => result.add(p));
  }
  return result;
}

export function hasRole(roles: string[], allowed: RoleName | RoleName[]): boolean {
  const list = Array.isArray(allowed) ? allowed : [allowed];
  return roles.some((r) => list.includes(r as RoleName));
}

export function hasPermission(roles: string[], permission: PermissionKey): boolean {
  return permissionsForRoles(roles).has(permission);
}

// Where each role lands after authentication.
export function homeForRoles(roles: string[]): string {
  if (hasRole(roles, ROLES.ADMIN)) return "/espace-admin";
  if (hasRole(roles, ROLES.STAFF)) return "/espace-staff";
  return "/espace-client";
}
