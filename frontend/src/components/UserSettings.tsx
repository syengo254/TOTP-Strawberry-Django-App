import { gql, useMutation } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import useVerify from "../hooks/auth/useVerify";
import Navbar from "./Navbar";

const ENABLE_TWO_FACTOR = gql`
mutation EnableTwoFactor {
    enableTwoFactor {
        success
        message
        created
        device {
            id
            name
            confirmed
            qrCode
            key
            user {
                id
            }
        }
      }
  }
`

const DISABLE_TWO_FACTOR = gql`
mutation DisableTwoFactor {
    disableTwoFactor {
      message
      success
    }
  }
`

const VERIFY_PASSWORD = gql`
mutation VerifyPassword($password: String!) {
    verifyPassword(password: $password) {
        message
        success
    }
}
`

const QRCodeView = ({device} : any) => {
    const { setUser } = useUserContext();
    const [qrcode, setQrcode] = useState('');
    const { handleVerify, success, error: verifyError, loading } = useVerify(true);
    const apiUrl = import.meta.env["VITE_API_URL"] || "http://localhost:8000/";

    if(success){
        setUser((old:any) => ({...old, twoFaEnabled: true}));

        return (
            <div>
                Congratulations! You have successfully setup two factor authentication.
            </div>
        )
    }

    return (
        <div>
            <p>Scan the below QR code with your authenticator app and then enter the code shown on the authenticator app below to verify.</p>
            <img src={`${apiUrl}${device.qrCode}`} alt="qr-code" width={300} />
            <p>Incase you do not have a QR Code scanner app, enter the below code directly on your authenticator app e.g. Google Authenticator</p>
            <input type="text" value={device.key} readOnly />
            <form onSubmit={e => handleVerify(e, qrcode)}>
                <label>
                    <p>Enter the code displayed on your authenticator app:</p>
                    <input type="text" value={qrcode} onChange={ e => setQrcode(e.target.value.trim())} required/>
                </label>
                {verifyError && (<div>
                {verifyError}
            </div>)}
                <div style={{ marginTop: '1rem'}}>
                    <button type="submit" disabled={loading}>Verify</button>
                </div>
            </form>
        </div>
    )
}

const PasswordConfirmView = ({setShowPasswordConfirm}: any) => {
    const {user, setUser} = useUserContext()
    const [password, setPassword] = useState('');
    const [loginMutation, { loading }] = useMutation(VERIFY_PASSWORD);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if(!password) return;

        loginMutation({
            variables: {
                username: user.username,
                password,
            }
        })
            .then(res => {
                const { verifyPassword } = res.data;

                if (verifyPassword && verifyPassword.success) {
                    if(errMsg) setErrMsg('');
                    setUser((old:any) => ({...old, twoFaEnabled: true}));
                    setShowPasswordConfirm(false);
                }
                else {
                    setErrMsg(verifyPassword ? verifyPassword.message : "Unspecified error occured!")
                }
            }).catch(err => console.log(err))
    }

    return (
        <div>
            <h3>Enter your password to confirm</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>
                        Password:
                    </p>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value.trim())}  required/>
                </label>
                <div style={{ marginTop: '1rem'}}>
                <button type="submit" disabled={loading}>Verify</button>
                {errMsg && (<div>
                {errMsg}
            </div>)}
                </div>
            </form>
        </div>
    )
}

const UserSettings = () => {
    const { user: {twoFaEnabled}, setUser } = useUserContext();
    const [showQRCode, setShowQRCode ] = useState(false);
    const [enableError, setEnableError] = useState('');
    const [enableTwoFactorMutation, {loading}] = useMutation(ENABLE_TWO_FACTOR);
    const [disableTwoFactorMutation, {loading: disableLoading}] = useMutation(DISABLE_TWO_FACTOR);
    const [totp, setTOTP] = useState<any | null>(null);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleClick = () => {
        if(twoFaEnabled){
            // disable
            if(!window.confirm("Are you sure?")) return;

            disableTwoFactorMutation()
            .then((res) => {
                const { disableTwoFactor } = res.data
                if(disableTwoFactor && disableTwoFactor.success){
                    setUser((old:any) => ({...old, twoFaEnabled: false}));
                    if(enableError){
                        setEnableError('')
                    }
                }
                else{
                    setEnableError(disableTwoFactor ? disableTwoFactor.message : "Unknown error occured.")
                }
            })
            .catch( e => setEnableError(e.message));
        } else {
            // enable
            enableTwoFactorMutation()
            .then( res => {
                const {enableTwoFactor} = res.data;
                if (enableTwoFactor){
                    const {success, message, device, created} = enableTwoFactor;
                    if(success){
                        if(enableError){
                            setEnableError('')
                        }
                        if(created){
                            setShowQRCode(true);
                            setTOTP(device);
                        }
                        else {
                            setShowPasswordConfirm(true);
                        }
                    }
                    else {
                        console.log(message);
                        setEnableError(message)
                    }
                }
            })
            .catch( e => {
                setEnableError(e.message);
            })
        }
    }

    return ( 
        <div>
            <Navbar />
            <h3>User Settings</h3>
            <hr />
            {showQRCode && <QRCodeView device={totp} />} 
            {showPasswordConfirm && <PasswordConfirmView setShowPasswordConfirm={setShowPasswordConfirm} />}
            <p>Two Factor Authentication: <b>{twoFaEnabled ? "Enabled" : "Disabled"}</b></p>
            <button onClick={handleClick} disabled={loading || disableLoading}>{twoFaEnabled ? "Disable Two Factor" : "Enable Two Factor"}</button>
            {enableError && (<div>
                {enableError}
            </div>)}
        </div>
     );
}
 
export default UserSettings;