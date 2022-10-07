const CodeViewPage = () => {
    return ( 
        <div>
            <h2>Enter the code from authenticator to proceed</h2>
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