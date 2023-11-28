import React, { useEffect, useState } from "react";
import Editor from "../editor/editor";
import Login from "../login/login";

import Spinner from "../spinner/spinner";
import authService from "../../services/authService";
import Services from "../../services/services";


export default function App() {
    const [auth, setAuth] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [loginLengthError, setLoginLengthError] = useState(false);
    const [load, setLoad] = useState(true);

    const authServiceCopy = new authService();
    const services = new Services();

    const login = (password, login) => {
        services.login(password, login)
            .then(res => {

                if(res.jwt_token) {
                    localStorage.setItem('token', res.jwt_token);
                    authServiceCopy.checkToken((isLog) => {
                        setAuth(isLog);
                    });
                }

            })
    }

    useEffect(() => {
        authServiceCopy.checkValid()
            .then(response => {
                setAuth(response.data.auth)
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setTimeout(() => {
                    setLoad(false);
                }, 3000)
            })
    }, []);

    let spinner;

    load ? spinner = <Spinner active/> :  spinner = <Spinner/>

    return (
        <div id="app">
            <main>
                    {
                        auth ? (<Editor />) : spinner
                    }
                    {
                        !auth ? (<Login login={login} lengthError={loginLengthError} logErr={loginError} />) : spinner
                    }
            </main>
        </div>
    )

}