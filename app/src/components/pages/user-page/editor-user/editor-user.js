import React, {useEffect, useState} from "react";
import showNotifications from "../../../../helpers/notifications";
import Services from "../../../../services/services";

export default function EditorUser({target, modal, user, loadUsersList}) {

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        login: '',
        password: '',
        email: '',
        phoneNumber: '',
        country: '',
        role: '',
        language: '',
        status: ''
    })

    let countryArr = ['Russia', 'China', 'Kanada'],
        roleArr = ["admin","moderator", "user"],
        languageArr = ["ER","RU", "ENG", "BY"],
        statusArr = ["active", "disable"];

    const services = new Services();


    const setData = (user) => {

        setUserData(userData => ({
            ...userData,
            id: user.id,
            name: user.name,
            login: user.login,
            password: user.password,
            email: user.email,
            phoneNumber: user.phoneNumber,
            country: user.country.toLowerCase(),
            role: user.role,
            language: user.language,
            status: user.status
        }))

    }

    const renderOptions = (arr) => {
        
        return arr.map((item, i) => {

            return <option value={item.toLowerCase()} key={i} data-option>{item.toLowerCase()}</option>
            
        });
    }

    const handleChange = (e) => {

        const param = e.target.id;

        switch (param) {
            case 'country':

                setUserData(userData => ({
                    ...userData,
                    country: e.target.value
                }))

                break;
            case 'role':

                setUserData(userData => ({
                    ...userData,
                    role: e.target.value
                }))

                break;
            case 'language':

                setUserData(userData => ({
                    ...userData,
                    language: e.target.value
                }))
                    
                break;
            case 'status':
            
                setUserData(userData => ({
                    ...userData,
                    status: e.target.value
                }))

                break;
        }

    }

    const onValueChange = (e, stateName) => {

        setUserData(userData => ({
            ...userData,
            [stateName]: e.target.value
        }))

    }

    const applyUserData = async (e) => {

        e.preventDefault();

        const form = document.querySelector('#form-user');

        let formData = new FormData(form);

        formData.append('id', userData.id);

        services.postNewUserData(formData)
            .then(() => {
                loadUsersList();
                showNotifications({message: 'Данные успешно изменены', status: 'success'});
            })
            .catch(() => showNotifications('Что-то пошло не так', 'danger'))
    }

    useEffect(() => {
        try {
            setData(user);
        } catch(e) {}

        document.querySelectorAll('.user-select').forEach(select => {
            select.addEventListener('change', (e) => {
                handleChange(e);
            })
        })

        document.querySelectorAll('[data-title]').forEach(input => {
            input.addEventListener('input', (e) => {
                let inputName = e.target.getAttribute('data-title');
                onValueChange(e, inputName);
            })
        })

        document.querySelector('.btn-apply-form').addEventListener('click', (e) => {
            e.preventDefault();
            
            applyUserData(e);
        })
    }, [])

    useEffect(() => {
        setData(user);
    }, [user]);

    return (
        <div id={target} uk-modal={modal.toString()}>
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">{`Редактирование пользователя #${userData.id}`}</h2>

                <form encType="multipart/form-data" method="post" name="form-user" id="form-user">
                    <div className="uk-margin">
                        <div className="uk-form-controls">
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="Имя" name="name" data-title="name" value={userData.name} onChange={(e) => this.onValueChange(e, 'name')}/>
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="Логин" name="login" data-title="login" value={userData.login} onChange={(e) => this.onValueChange(e, 'login')}/>
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="Пароль" name="password" data-title="password" value={userData.password} onChange={(e) => this.onValueChange(e, 'password')}/>
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="Почта" name="email" data-title="email" value={userData.email} onChange={(e) => this.onValueChange(e, 'email')}/>
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="Номер телефона" name="phoneNumber" data-title="phoneNumber" value={userData.phoneNumber} onChange={(e) => this.onValueChange(e, 'phoneNumber')}/>
                        </div>
                    </div>
                    <div className="uk-margin">
                        <div className="uk-form-label">Страна</div>
                        {userData.country} 
                        <select value={userData.country} id="country" className="uk-select user-select" name="country" aria-label="Select" onChange={(e) => handleChange(e)}>
                            {renderOptions(countryArr)}
                        </select>
                    </div>
                    <div className="uk-margin">
                        <div className="uk-form-label">Роль пользователя</div>
                        <select className="uk-select user-select" aria-label="Select" name="role" value={userData.role} id="role" onChange={(e) => handleChange(e)}>
                            {renderOptions(roleArr)}
                        </select>
                    </div>
                    <div className="uk-margin">
                        <div className="uk-form-label">Язык интерфейса</div>
                        <select className="uk-select user-select" aria-label="Select" name="language" value={userData.language} id="language" onChange={(e) => handleChange(e)}>
                            {renderOptions(languageArr)}
                        </select>
                    </div>
                    <div className="uk-margin">
                        <div className="uk-form-label">Статус аккаунта</div>
                        <select className="uk-select user-select" aria-label="Select" name="status" value={userData.status} id="status" onChange={(e) => handleChange(e)}>
                            {renderOptions(statusArr)}
                        </select>
                    </div>
                </form>

                <button className="uk-button uk-button-danger uk-margin-small-right uk-modal-close" type="button">Отменить</button>
                <button className="uk-button uk-button-primary uk-modal-close btn-apply-form" type="button">Сохранить</button>
            </div>
        </div>
    )

}