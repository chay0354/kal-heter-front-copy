# kal-heter-front

React frontend for the Kal-Heter permit application system.

---

## Mailing Service

### Overview

There is **no dedicated mailing service file** in this frontend project. Email sending is not performed by the frontend at all — it is fully delegated to **Supabase Auth**, which handles transactional emails automatically on the backend.

---

### How it works

The only email trigger in this application is the **signup email confirmation** flow.

#### Service file: `src/services/auth.js`

This file is the auth service. It does not send emails directly, but it initiates the flow that causes Supabase to send a confirmation email.

**Relevant function:** `signUp(email, password, phone, fullName)`

```js
// src/services/auth.js
export const signUp = async (email, password, phone = null, fullName = null) => {
  const response = await fetch(buildApiUrl('/api/auth/signup'), { ... })
  // If email confirmation is required, Supabase sends the email automatically.
  return { success: false, requiresEmailConfirmation: true, message: '...' }
}
```

The function POSTs to the backend endpoint `/api/auth/signup`. The backend (FastAPI + Supabase) calls Supabase Auth's sign-up method, and **Supabase automatically sends a confirmation email** to the user's address.

---

### Where `signUp` is called

`signUp` is imported and called from the authentication UI. To find the exact component:

```
src/services/auth.js  →  signUp()
```

Search for `signUp` across the codebase to locate the calling component (e.g. a registration form or auth modal).

---

### Contact form

`src/components/landing/ContactFormSection/index.jsx` collects a name, email, and phone number but **does not send any email**. Its submit handler currently only logs the form data to the console. No mailing logic is wired up there.

---

### Summary table

| What | Where | Sends email? |
|------|-------|-------------|
| Signup confirmation email | Triggered by `signUp()` in `src/services/auth.js`, sent by Supabase Auth | Yes (via Supabase) |
| Contact form submission | `src/components/landing/ContactFormSection/index.jsx` | No (console.log only) |

---

### Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend |
| `VITE_SUPABASE_URL` | Supabase project URL (used for token refresh fallback) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (used for token refresh fallback) |
