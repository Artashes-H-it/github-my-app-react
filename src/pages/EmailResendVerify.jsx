import { Button } from "../components/ui";
import api from "../api/axios";


const EmailResendVerify = () => {


    const resendVerification = async() => {
        try {
            await api.post("/resend-verification");
        } catch (error) {
           console.error("Error resending verification:", error);
        }
    }

    return (
            <>
            <h2>Verify your email</h2>
            <Button type={'button'} onClick={resendVerification}>Resen Verification email</Button>
            </>
    )
}

export default EmailResendVerify;