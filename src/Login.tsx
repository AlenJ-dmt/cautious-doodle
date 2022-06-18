import { Button } from "@mui/material"
import { auth, provider } from "./firebase"
import { actionTypes } from "./reducer"
import { useStateValue } from "./StateProvider"
import { useNavigate } from "react-router-dom"
export const Login = () => {

    const [{ }, dispatch] = useStateValue()
    let  navigate = useNavigate()

    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then(result => {
                localStorage.setItem("USER_ID", result.additionalUserInfo?.profile!.id)
                localStorage.setItem("USER_NAME", result.additionalUserInfo?.profile!.name)
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user

                })
                navigate("../rooms/50OkbmJUkuWtIH2KJTiA", { replace: true });
            })
            .catch(err => alert(err.message))
    }
    return (
        <div className="login">
            <div className="login__container">
                <Button onClick={signIn}>
                    Sign in
                </Button>
            </div>
        </div>
    )

}