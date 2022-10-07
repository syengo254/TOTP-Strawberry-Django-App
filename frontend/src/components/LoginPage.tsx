const LoginPage = () => {
    const handleLogin = () => {
        //
    }
    
    return ( 
        <div>
            <h2>Login Page</h2>
            <form onSubmit={handleLogin}>
                <label>
                    <p>Username</p>
                    <input type="text"  required/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password"  required/>
                </label>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
     );
}
 
export default LoginPage;