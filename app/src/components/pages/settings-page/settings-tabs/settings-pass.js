import React, { useEffect, useState } from "react";
import Services from "../../../../services/services";

export default function SettingsPass({id}) {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const services = new Services();

    const setVisible = (element, errorVisible, successVisible) => { // переписать на true || false
        if (successVisible) {
            element.classList.remove('visible');
            element.classList.add('success');

        } else if (errorVisible) {
            element.classList.remove('success');
            element.classList.add('visible');

        }
    }

    const clearErrorMessage = (err) => {
        err.textContent = '';
    }

    const validateData = async (target, name) => {

        const errorContainer = target.closest('li');
        const errorMessage = target.closest('li').querySelector('.error-message');


            if (name === 'current-pwd') {

                if (target.value === '') {

                    errorMessage.textContent = 'Поле не может быть пустым';
                    setVisible(errorContainer, true, false);
                    return false;

                } else {

                    let isValid;

                    services.validateData(currentPassword, id)
                        .then(res => {
                            const responseMessage = res.message;

                            if (responseMessage === 'ok') {
                                clearErrorMessage(errorMessage);
                                setVisible(errorContainer, false, true);
                                
                                isValid = true;
        
                            } else if (responseMessage == '401') {
    
                                errorMessage.textContent = 'Пароль не подходит';
                                setVisible(errorContainer, true, false);
        
                                isValid = false;
                            }
                    
                            return isValid;
                        })
                }

            } else if (name === 'new-pwd') { 

                if (target.value === '') {
                    errorMessage.textContent = 'Поле не может быть пустым';

                    setVisible(errorContainer, true, false);

                    return false;
                } else if (!target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
                    errorMessage.textContent = 'Пароль должен состоять минимум из 8 символов, и содержать: 1 букву в нижнем регистре, 1 букву в верхнем регистре и 1 цифру';
                    
                    setVisible(errorContainer, true, false);

                    return false;
                } else {

                    setVisible(errorContainer, false, true);

                    return true;

                }

            } else if (name === 'confirm-pwd') { 

                if (target.value === '') {
                    errorMessage.textContent = 'Поле не может быть пустым';
                    
                    setVisible(errorContainer, true, false);

                    return false;
                } else if (target.value !== newPassword) {
                    errorMessage.textContent = 'Пароли не совпадают, проверьте правильность введеных данных';
                    
                    setVisible(errorContainer, true, false);

                    return false;
                } else {
                    
                    setVisible(errorContainer, false, true);

                    return true;

                }

            } else {
                return true;
            }


    }

    const copyPasteDisable = () => {
        document.querySelectorAll('.pass-data input').forEach(input =>  {
            input.addEventListener('copy', (e) => {
                e.preventDefault();
            });
            input.addEventListener('paste', (e) => {
                e.preventDefault();
            });
        })
    }

    const postNewPwd = async (id, currentPassword, newPassword) => {

        services.postNewPwd(newPassword, currentPassword, id)
            .then((res) => {
                console.log(res);
                setConfirmPassword('');
                setCurrentPassword('');
                setNewPassword('');
            })
            .catch(() => showNotifications('Что-то пошло не так', 'danger'))

    }

    useEffect(() => {
        // copyPasteDisable();
    }, [])

    return (

        <div className="user-password-data">

            <div className="user-data__body d-flex">

                <div className="mount">

                    <div className="user-data__main-info">
                        <div className="personal__wrapper d-flex">
                            <h6>Пароль</h6>
                            <p>Для изменения пароля, ведите ваш текущий пароль</p>
                        </div>
                        <ul className="pass-data d-flex">
                            
                            <li>
                                <label htmlFor="">
                                    Текущий пароль
                                    <input className="uk-input" type="text" placeholder="Пароль" aria-label="Input" name="password" value={currentPassword}  data-name={'current-pwd'} 
                                        onInput={(e) => {
                                            setCurrentPassword(e.target.value)
                                        }} 
                                        onBlur={(e) => {
                                            validateData(e.target, e.target.getAttribute('data-name'))
                                        }}  
                                    />
                                </label>
                                <p className="error-message">error message</p>
                            </li>

                            <li>
                                <label htmlFor="">
                                    Новый пароль
                                    <input className="uk-input " type="text" placeholder="Пароль" aria-label="Input" name="password" value={newPassword} data-name={'new-pwd'}
                                        onInput={(e) => {
                                            setNewPassword(e.target.value)
                                        }}  
                                        onBlur={(e) => {
                                            validateData(e.target, e.target.getAttribute('data-name'))
                                        }}
                                    />
                                </label>
                                <p className="error-message">error message</p>
                            </li>
                            
                            <li>
                                <label htmlFor="">
                                    Подтверждение нового пароля
                                    <input className="uk-input" type="text" placeholder="Пароль" aria-label="Input" name="password" value={confirmPassword} data-name={'confirm-pwd'} 
                                        onInput={(e) => {
                                            setConfirmPassword(e.target.value)
                                        }} 
                                        onBlur={(e) => {
                                            validateData(e.target, e.target.getAttribute('data-name'))
                                        }}
                                    />
                                </label>
                                <p className="error-message">error message</p>
                            </li>

                        </ul>
                    </div>

                    <div className="btn-collection d-flex">

                        <a href="#">Отмена</a>

                        <button className="uk-button" onClick={async (e) => {
                            const results = await Promise.all(Array.from(document.querySelectorAll("[data-name]")).map(async input => {
                                return await validateData(input, input.getAttribute('data-name'));
                            }));

                            !results.includes(false) ? postNewPwd(id, currentPassword, newPassword) : null
                        }}>Обновить пароль</button>

                    </div>

                </div>

            </div>

        </div>
        
    );

}