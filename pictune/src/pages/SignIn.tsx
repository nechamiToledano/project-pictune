import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import {  userLogin } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (data: { userName: string; password: string }) => {
    try {
      const result = await dispatch(userLogin({ userName: data.userName, password: data.password }));
      if (userLogin.fulfilled.match(result)) {
  navigate("/");

      window.location.reload();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return <AuthForm defaultTab="signin" onAuthSubmit={handleLogin} />;
};

export default SignIn;
