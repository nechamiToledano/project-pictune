import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import {   userLogin } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (data: { userName: string; password: string }) => {
    try {
      const result = await dispatch(userLogin(data));
      if (userLogin.fulfilled.match(result)) {
        toast.success("You have successfully connected.")

        navigate("/");
      } else {
        toast.error("שם משתמש או סיסמה שגויים!");
      }
    } catch (error) {
      toast.error("אירעה שגיאה בעת התחברות!");
      console.error("Login failed:", error);
    } }

  return <AuthForm defaultTab="signin" onAuthSubmit={handleLogin} />;
};

export default SignIn;
