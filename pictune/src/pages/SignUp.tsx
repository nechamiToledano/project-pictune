import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { userSignup } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store"; // Adjust the path to where your store is defined

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignUp = async (data: { userName: string; email?: string; password: string }) => {
    try {
      if (!data.email) {
        throw new Error("Email is required for signing up.");
      }

      const result = await dispatch(userSignup({
        userName: data.userName,
        email: data.email,
        password: data.password,
      }));

      if (userSignup.fulfilled.match(result)) {
        navigate("/");
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
    }
  };

  return <AuthForm defaultTab="signup" onAuthSubmit={handleSignUp} />;
};

export default SignUp;
