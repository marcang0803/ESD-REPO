// API interface for user-related backend calls
export async function fetchUser(userId) {
  // Adjust the URL to match your backend API gateway/Kong route
  const res = await fetch(`/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
