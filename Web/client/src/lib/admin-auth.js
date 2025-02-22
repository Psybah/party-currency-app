// Hardcoded admin credentials
const ADMIN_CREDENTIALS = [
  { username: "Doyin", password: "MainAdmin$" },
  { username: "admin2", password: "Admin2$" }
];

export function validateAdminCredentials(username, password) {
  return ADMIN_CREDENTIALS.some(
    admin => admin.username === username && admin.password === password
  );
}

export function setAdminAuth(username) {
  localStorage.setItem('adminAuth', JSON.stringify({ username, isAuthenticated: true }));
}

export function getAdminAuth() {
  const auth = localStorage.getItem('adminAuth');
  if (!auth) return { isAuthenticated: false, username: null };
  return JSON.parse(auth);
}

export function clearAdminAuth() {
  localStorage.removeItem('adminAuth');
}

export function requireAdminAuth(navigate) {
  const { isAuthenticated } = getAdminAuth();
  if (!isAuthenticated) {
    navigate('/admin/login');
    return false;
  }
  return true;
}
