// API interface for user-related backend calls
export async function fetchUser(userId) {
  // Adjusted to match the correct backend endpoint
  const res = await fetch(`/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
