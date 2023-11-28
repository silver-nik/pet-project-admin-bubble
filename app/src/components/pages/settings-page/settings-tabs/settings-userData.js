import React from "react";
import Services from "../../../../services/services";

export default function SettingsUserData({user, getUserData, setUser}) {

    const services = new Services();

    const editUserData = (e, elementsClassName) => {
        e.preventDefault();

        document.querySelectorAll(elementsClassName).forEach(el => {
            el.classList.toggle('_disabled');

            let attr = el.getAttribute('data-attr');

            el.addEventListener('input', (e) => {
                setUser(user => ({
                    ...user,
                    [attr]: e.target.value
                }))
            })
        })

    }

    const postNewUserData = async () => {

        services.postNewUserData(user)
            .then((res) => {
                getUserData();
            })
            .catch(() => showNotifications('Что-то пошло не так', 'danger'))
    }

    return (
        <div className="user-data w-100">

            <div className="">

                <div className="mount">
                    <div className="user-data__top d-flex general-info">

                        <div className="d-flex align-items-center">
                            <img src="http://react-admin/img/downloads/user.jpg" className="rounded-circle img-md" alt="" />

                            <ul className="user-data__small-info _enable-edit">
                                <li>
                                    <input type="text" value={user.name} data-attr="name" className="editable-data _disabled" />
                                </li>
                                <li className="text-muted">
                                    <input type="text" value={user.position} data-attr="position" className="editable-data _disabled" />
                                </li>
                                <li>
                                    <input type="text" value={user.country} data-attr="country" className="editable-data _disabled" />
                                </li>
                            </ul>
                        </div>

                        <a href="#" onClick={(e) => {
                            editUserData(e, '.general-info .editable-data');
                        }}>
                            Редактировать
                            <span uk-icon="pencil"></span>
                        </a>

                    </div>
                </div>

                <div className="user-data__body d-flex">

                    <div className="mount">

                        <div className="user-data__main-info more-info">
                            <div className="personal__wrapper d-flex align-items-center">
                                <h6>Персональная Информация</h6>
                                <a href="#" onClick={(e) => {
                                    editUserData(e, '.more-info .editable-data');
                                }}>
                                    Редактировать
                                    <span uk-icon="pencil"></span>
                                </a>
                            </div>
                            <ul className="main-info _enable-edit">
                                
                                <li>
                                    <span className="text-muted">Фамилия Имя</span>
                                    <input type="text" value={user.name} data-attr="name" className="editable-data _disabled" />
                                </li>
                                <li>
                                    <span className="text-muted">Email адрес</span>
                                    <input type="text" value={user.email}  data-attr="email"className="editable-data _disabled" />
                                </li>
                                <li>
                                    <span className="text-muted">Номер телефона</span>
                                    <input type="text" value={user.phoneNumber}  data-attr="phoneNumber"className="editable-data _disabled" />
                                </li>
                                <li>
                                    <span className="text-muted">Био</span>
                                    <input type="text" value={user.bio}  data-attr="bio"className="editable-data _disabled" />
                                </li>

                            </ul>
                        </div>

                    </div>

                </div>

                <div className="user-data__body d-flex">

                    <div className="mount">

                        <div className="user-data__main-info additional-info">
                            <div className="personal__wrapper d-flex align-items-center">
                                <h6>Адрес</h6>
                                <a href="#" onClick={(e) => {
                                    editUserData(e, '.additional-info .editable-data');
                                }}>
                                    Редактировать
                                    <span uk-icon="pencil"></span>
                                </a>
                            </div>
                            <ul className="main-info _enable-edit">
                                
                                <li>
                                    <span className="text-muted">Страна</span>
                                    <input type="text" value={user.country} data-attr="country" className="editable-data _disabled" />
                                </li>
                                <li>
                                    <span className="text-muted">Город</span>
                                    <input type="text" value={user.location} data-attr="location" className="editable-data _disabled" />
                                </li>

                            </ul>
                        </div>

                        <div className="btn-collection d-flex mt-3 jc-end">

                            <button className="uk-button" onClick={(e) => {
                                postNewUserData()
                            }}>Сохранить изменения</button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}