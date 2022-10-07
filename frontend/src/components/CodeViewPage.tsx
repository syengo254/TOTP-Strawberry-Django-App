const CodeViewPage = () => {
    return ( 
        <div>
            <h2>Two Factor Authentication</h2>
            <small>Enter the code from authenticator app to proceed.</small>
            <hr />
            <form>
                <label>
                    <p>Authentication Code:</p>
                    <input type="text" maxLength={8} required/>
                </label>
                <div style={{marginTop: '1rem'}}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
     );
}
 
export default CodeViewPage;