export const DEMO_CREDENTIALS = {
  email: "admin@lukascope.com",
  password: "password123",
} as const;

export const SESSION_COOKIE_NAME = "session";

export function isDemoUser(email: string, password: string) {
  return email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
}

export function getDisplayNameFromEmail(email: string) {
  const name = email.split("@")[0]?.split(/[._-]/)[0]?.trim();

  if (!name) {
    return "User";
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}
