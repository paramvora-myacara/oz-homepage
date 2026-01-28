# Auth Mechanism: Pending Action Recovery

To provide a seamless experience for unauthenticated users interacting with restricted listing features (like Vault Access or Contact Developer), we use a `localStorage`-based pending action recovery mechanism.

## Overview

When an unauthenticated user clicks a protected button:
1.  The application saves the intended action and relevant context (e.g., listing `slug`) to `localStorage`.
2.  The user is prompted to sign in via the unified `AuthModal`.
3.  After successful authentication, the application detects the pending action and automatically executes it.

## Implementation Details

### 1. Storing the Pending Action

We use the key `OZL_PENDING_ACTION` to store a JSON object containing the action type and slug.

```typescript
// Example from ListingActionButtons.tsx
const handleVaultAccess = async () => {
  if (!user) {
    localStorage.setItem('OZL_PENDING_ACTION', JSON.stringify({ 
      type: 'vault-access', 
      slug: 'my-listing-slug' 
    }));
    openModal({
      title: "Request Vault Access",
      description: "Sign in to access confidential deal documents.",
      redirectTo: `/listings/${slug}`
    });
    return;
  }
  // Proceed with authenticated logic...
};
```

### 2. Recovering the Action

Component-level `useEffect` hooks monitor the `user` state. Once `user` becomes available (sign-in complete), they check for and execute any matching pending actions.

```typescript
useEffect(() => {
  const recoverAction = async () => {
    if (user) {
      const pending = localStorage.getItem('OZL_PENDING_ACTION');
      if (pending) {
        try {
          const { type, slug: pendingSlug } = JSON.parse(pending);
          if (pendingSlug === slug) {
            if (type === 'vault-access') handleVaultAccess();
            else if (type === 'contact-developer') handleContactDeveloper();
          }
        } catch (e) {
          console.error('Failed to recover pending action', e);
        } finally {
          localStorage.removeItem('OZL_PENDING_ACTION');
        }
      }
    }
  };
  recoverAction();
}, [user, slug]);
```

## Key Benefits

- **Persistent across reloads**: Unlike `sessionStorage`, `localStorage` survives the redirect flow if the auth provider uses a full page redirect (though our current setup is modal-based, this adds robustness).
- **Decoupled from AuthProvider**: The global authentication provider doesn't need to know about specific listing actions. Recovery is handled by the relevant component.
- **Consistent UX**: Users are returned exactly to where they were and their intended action is triggered immediately.

## Pages Using This Mechanism

- `/listings/[slug]` (via `ListingActionButtons.tsx`)
- `/listings/[slug]/access-dd-vault` (via `ddv-vault-client.tsx`)
- `/qozb-support` (uses a similar `OZL_PENDING_SUPPORT` key)
