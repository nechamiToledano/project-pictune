import { autoLogin, userLogout } from "@/store/slices/userSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const AppInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    // רק אם המשתמש מגיע לעמוד הכניסה נריץ autoLogin
    if (location.pathname === "/signin") {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(autoLogin());
      } else {
        dispatch(userLogout());
      }
    }
  }, [dispatch, location.pathname]);

  return null;
};

export default AppInitializer;
