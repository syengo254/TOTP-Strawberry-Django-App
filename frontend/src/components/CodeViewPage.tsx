import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import useVerify from "../hooks/auth/useVerify";

const CodeViewPage = () => {
    const {twoFactorUnverified, authenticated, setUser} = useUserContext();
    const { handleVerify, success, error, loading } = useVerify();
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    useEffect(() => {
        if(authenticated && !twoFactorUnverified){
            navigate('/dashboard');
        }
    }, [authenticated, twoFactorUnverified]);


    useEffect(() => {
        if(success){
            setUser((old: any) => ({
                ...old,
                twoFactorAuthenticated: true,
            }));
        }
    }, [success])

    return ( 
        <div>
            <h2>Two Factor Authentication</h2>
            <small>Enter the code from authenticator app to proceed.</small>
            <hr />
            <form onSubmit={e => handleVerify(e, code)}>
                <label>
                    <p>Authentication Code:</p>
                    <input type="text" value={code} onChange={e => setCode(e.target.value.trim())} maxLength={6} required/>
                </label>
                {error && <div style={{margin: '.5rem'}}>
                    {error}
                </div>}
                <div style={{marginTop: '1rem'}}>
                    <button type="submit" disabled={loading}>Submit</button>
                </div>
            </form>
        </div>
     );
}
 
export default CodeViewPage;