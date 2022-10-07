import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const VERIFY_TOKEN = gql`
mutation VerifyToken($token: String!, $setup: Boolean) {
    verifyToken(token: $token, setup: $setup) {
        message
        success
    }
}
`

export default function useVerify(setup:Boolean = false){
    const [verifyMutation, {loading}] = useMutation(VERIFY_TOKEN);
    const [verifyError, setVerifyError] = useState('')
    const [verifySuccess, setVerifySuccess] = useState(false);

    const handleVerify = (e: FormEvent, code: string) => {
        e.preventDefault();
        
        if(!code || code.length < 6){
            setVerifyError("Code must be 6 characters long.");
            return;
        };

        verifyMutation({
            variables: {
                token: code,
                setup,
            }
        })
        .then(res => {
            const {success, message} = res.data.verifyToken;
            if(success){
                if(verifyError) setVerifyError('');

                setVerifySuccess(success);
            }
            else {
                setVerifyError(message)
            }
        })
        .catch( err => setVerifyError(err.message));
    }

    return { handleVerify, success: verifySuccess, error: verifyError, loading }

}