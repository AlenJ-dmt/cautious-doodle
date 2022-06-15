import { Button } from "@mui/material"
import { auth, provider } from "./firebase"
import { actionTypes } from "./reducer"
import { useStateValue } from "./StateProvider"
export const Login = () => {

    const [{ }, dispatch] = useStateValue()

    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then(result => {
                console.log(result.additionalUserInfo?.profile!.id)
                localStorage.setItem("USER_ID", result.additionalUserInfo?.profile!.id)
                localStorage.setItem("USER_NAME", result.additionalUserInfo?.profile!.name)
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user

                })
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