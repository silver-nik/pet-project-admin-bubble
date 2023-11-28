import React, {Component, useState} from "react";
import UIkit from "uikit";
import axios from "axios";

import showNotifications from "../../../../helpers/notifications";
import Services from "../../../../services/services";

export default function CreateUserModal({loadUsersList}) {
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [gender, setGender] = useState('');

    const services = new Services();

    const createUser = async (e, login, password, gender) => {

        e.preventDefault();

        const form = document.querySelector('#form');

        if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) || password.length < 8) {
            console.log('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number');
        } else if(!login.match(/^[a-z0-9_-]{3,16}$/) || login.length < 8) {
            console.log('Login inccorrect');
        } else if(gender === '') {
            console.log('Sex must be choosen');
        }
        else {

            let formData = new FormData(form);

            services.createUser(formData)
                .then((res) => {
                    console.log(res);
                    loadUsersList();
                    showNotifications({message: 'Успешно сохранено', status: 'success'});
                })
                .catch(() => showNotifications('Ошибка создания', 'danger'))
                .finally(() => {
                    setLogin('');
                    setPassword('');
                    setGender('');
                    form.reset();
                })

        }

    }

    return (
        <div className="mount w-50 mt-3 page__user-create">
            <form encType="multipart/form-data" method="post" name="form" id="form">
                <fieldset className="uk-fieldset">

                    <legend className="uk-legend">Создание пользователя</legend>

                        <input className="uk-input" type="text" placeholder="Логин" aria-label="Input" name="login" value={login} onChange={(e) => setLogin(e.target.value)}/>
                        <input className="uk-input" type="text" placeholder="Пароль" aria-label="Input" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                    <div className="uk-margin">
                        <p>Укажите пол</p>
                        <select className="uk-select" aria-label="Select" name="gender" onChange={(e) => setGender(e.target.value)}> 
                            <option value=""></option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>

                    <button className="uk-button uk-margin-small-right uk-margin-small-top submit-btn" onClick={(e) => {
                        createUser(e, login, password, gender);
                    }}>Создать пользователя</button>

                </fieldset>
            </form>
        </div>
    )

}