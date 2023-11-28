import React, {useState} from "react";

export default function Login({login, lengthError, logErr}) {
    const [pwd, setPwd] = useState('');
    const [loginName, setLoginName] = useState('');

    let renderLogError, renderLengthError;

    logErr ? renderLogError = <span className="login-error">Введены неправильные данные, проверьте правильность и попробуйте снова</span> : null;

    lengthError ? renderLengthError = <span className="login-error">Пароль не должен быть менее 10 символов, а логин не менее 5</span> : null;

    return (
        <div className="login-container">
            <div className="login">
                <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
                <h6>Авторизируйтесть для продолжения</h6>
                <input 
                    type="text" 
                    name="" 
                    id="login" 
                    className="uk-input uk-margin-top" 
                    placeholder="Логин"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}/>
                <input 
                    type="password" 
                    name="" 
                    id="password" 
                    className="uk-input uk-margin-top" 
                    placeholder="Пароль"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}/>
                    {renderLogError}
                    {renderLengthError}
                <button 
                    className="uk-button uk-button-primary" 
                    type="button"
                    onClick={(e) => {
                        login(pwd, loginName)
                    }}>Вход</button>
            </div>
        </div>
    )
}