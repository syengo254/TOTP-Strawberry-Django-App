import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { useUserContext } from "../context/UserContext";
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

const VERIFY_TOKEN = gql`
mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
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
    const [verifyMutation, {loading}] = useMutation(VERIFY_TOKEN);
    const [verifyError, setVerifyError] = useState('')
    const [verifySuccess, setVerifySuccess] = useState(false);

    const handleVerify = (e: FormEvent) => {
        e.preventDefault()
        if(!qrcode || qrcode.length < 6) return;

        verifyMutation({
            variables: {
                token: qrcode,
            }
        })
        .then(res => {
            const {success, message} = res.data.verifyToken;
            if(success){
                setVerifySuccess(true);
                if(verifyError) setVerifyError('');
                setUser((old:any) => ({...old, twoFaEnabled: true}));
            }
            else {
                setVerifyError(message)
            }
        })
        .catch( err => setVerifyError(err.message));
    }

    if(verifySuccess){
        return (
            <div>
                Congratulations! You successfully setup two factor authentication.
            </div>
        )
    }

    return (
        <div>
            <p>Scan the below QR code with your authenticator app and then enter the code shown on the authenticator app below to verify.</p>
            <img src={`http://localhost:8000/${device.qrCode}`} alt="qr-code" width={300} />
            <p>Incase you do not have a QR Code scanner app, enter the below code directly on your authenticator app e.g. Google Authenticator</p>
            <input type="text" value={device.key} readOnly />
            <form onSubmit={handleVerify}>
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