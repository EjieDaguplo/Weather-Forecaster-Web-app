import Cookies from "js-cookie";

export function getUser() {
  const cookie = Cookies.get("auth_user");
  return cookie ? JSON.parse(cookie) : null;
}

export function getToken() {
  return Cookies.get("auth_token") || null;
}

export function logout() {
  Cookies.remove("auth_token");
  Cookies.remove("auth_user");
  window.location.href = "/login";
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === "admin";
}
