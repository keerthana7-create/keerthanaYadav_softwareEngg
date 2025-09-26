import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuthGuard() {
  const user = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  return { user };
}
