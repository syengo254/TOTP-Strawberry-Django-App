import { gql, useMutation } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LOGIN_USER = gql`
mutation($username: String!, $password: String!) {
    userLogin(username: $username , password: $password){
      user {
        id
        username
        email
        twoFaEnabled
      }
      message
    }
  }
`

const LoginPage = () => {
    const { setUser, authenticated } = useUserContext();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate();

    const [loginMutation, { loading }] = useMutation(LOGIN_USER);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        if (errMsg.length) {
            setErrMsg('');
        }

        loginMutation({
            variables: {
                username,
                password,
            }
        })
            .then(res => {
                const { userLogin } = res.data;

                if (userLogin) {
                    if (userLogin.user) {
                        setUser(userLogin.user);
                    }
                    else {
                        setErrMsg(userLogin.message);
                    }
                }
                else {
                    setErrMsg("Unspecified error occured!")
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (authenticated) {
            navigate('/dashboard');
        }
    }, [authenticated]);

    return (
        <div>
            {!authenticated && (
            <>
                <h2>Login Page</h2>
                <hr />
                <form onSubmit={handleLogin}>
                    <label>
                        <p>Username</p>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value.trim())} autoFocus required />
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value.trim())} required />
                    </label>
                    {errMsg && <div style={{ border: "1px solid orangered", padding: ".2rem .4rem", width: 'fit-content', margin: '.5rem 0' }}>
                        {errMsg}
                    </div>}
                    <div style={{ marginTop: "1rem"}}>
                        <button type="submit" disabled={loading}>Login</button>
                    </div>
                </form>
            </>
            )}
        </div>
    );
}

export default LoginPage;