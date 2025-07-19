// import { useNavigate } from "react-router-dom";
// import AuthForm from "../components/AuthForm";
// import {   userLogin } from "@/store/slices/userSlice";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/store";
// import { toast } from "sonner";

// const SignIn: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
 
  
//   const handleLogin = async (data: { userName: string; password: string }) => {
//     try {
//       const result = await dispatch(userLogin(data));
//       if (userLogin.fulfilled.match(result)) {
//         toast.success("You have successfully connected.")

//          navigate("/");
//       } else {
//         toast.error("שם משתמש או סיסמה שגויים!");
//       }
//     } catch (error) {
//       toast.error("אירעה שגיאה בעת התחברות!");
//       console.error("Login failed:", error);
//     } }

//   return <AuthForm defaultTab="signin" onAuthSubmit={handleLogin} />;
// };

// export default SignIn;import { useNavigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const SignIn: React.FC = () => {
  const navigate = useNavigate()

  const handleLogin = async () => {
    toast.success("Trying to login...")
    await new Promise((res) => setTimeout(res, 1000))
    navigate("/")
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <button onClick={handleLogin} style={{ padding: "1rem", fontSize: "1.2rem" }}>
        Dummy Login
      </button>
    </div>
  )
}

export default SignIn


