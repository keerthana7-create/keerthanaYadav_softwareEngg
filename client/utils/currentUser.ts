export function ensureCurrentUser() {
  let id = localStorage.getItem("user_id");
  if (!id) {
    localStorage.setItem("user_id", "u1");
    localStorage.setItem("user_name", "Alex Rivera");
    localStorage.setItem("user_email", "alex@example.com");
    localStorage.setItem("user_avatar", "https://i.pravatar.cc/80?img=1");
    id = "u1";
  }
  return {
    id,
    name: localStorage.getItem("user_name") || "Alex Rivera",
    email: localStorage.getItem("user_email") || "alex@example.com",
    avatarUrl:
      localStorage.getItem("user_avatar") || "https://i.pravatar.cc/80?img=1",
  };
}
