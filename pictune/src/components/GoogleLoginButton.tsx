"use client"

import { GoogleLogin } from "@react-oauth/google"
import { googleLogin } from "@/store/slices/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function GoogleLoginButton() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/"); // או כל דף אחר שתרצי
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="w-full flex justify-center">
            <div style={{ colorScheme: 'dark' }}>

                <GoogleLogin
                    onSuccess={(res) => {
                        const credential = res.credential;
                        if (credential) {
                            dispatch(googleLogin(credential)).unwrap().then(() => {
                                navigate("/");
                            }).catch((err) => {
                                console.error("Login failed", err);
                            });
                        }
                    }}

                    onError={() => {
                        console.error("Google login failed")
                    }}
                    text="continue_with"
                    size="medium"
                    theme='filled_black'
                    shape='pill'
                    useOneTap={false}

                />
            </div>
        </div>
    )
}
