import React, { useEffect, useState, useRef } from "react";
import authService from "../../../services/authService";
import SettingsPass from "./settings-tabs/settings-pass";
import SettingsNotification from "./settings-tabs/settings-notification";
import SettingsAppearance from "./settings-tabs/settings-visual";
import SettingsUserData from "./settings-tabs/settings-userData";
import Services from "../../../services/services";

export default function SettingsEditor({color, theme, updateThemeStyles}) {

    const [user, setUser] = useState({});
    const authServiceRef = useRef(new authService());
    const [notificationsText, setNotificationsText] = useState({});

    const [activeTabs, setActiveTabs] = useState({
        userData: true,
        pwd: false,
        notifications: false,
        appearance: false
    })

    const services = new Services();

    const validateUser = () => {
        try {
            authServiceRef.current.checkToken((isLog, isRole, isColour, isTheme, isId) => {

                setUser(user  => ({
                    ...user,
                    auth: isLog,
                    role: isRole,
                    id: isId
                }))
    
            });
        } catch (error) {
            setUser(user  => ({
                ...user,
                auth: false,
                role: null,
                id: null
            }))
        }
    }

    const getUserData = () => {

        services.getUserData()
        // axios
        //     // .get(`http://localhost:4000/users?role=${user.role}&id=${user.id}`)
        //     .get('./api/settings.json') // .htaccess отключен, но должен быть включен, чтобы запретить доступ к этому Json из-за того, что там данные пользователей (надо доделать)
            .then((res) => {
                res.users.map((el) => {
                    if(el.id == user.id) {
                        setUser(user  => ({
                            ...user,
                            name: el.name,
                            email: el.email,
                            phoneNumber: el.phoneNumber,
                            country: el.country,
                            status: el.status,
                            language: el.language,
                            position: el.position,
                            bio: el.bio,
                            location: el.location,
                            // pwd: el.password
                        }))
                    }
                })
            })


    }

    const changeActiveElement = (e) => {

        if(e.target.classList.contains('tab')) {
            e.target.parentNode.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('uk-active');

                e.target.classList.add('uk-active');

            })

            let stateName = e.target.getAttribute('data-name');

            setActiveTabs({
                userData: false,
                pwd: false,
                notifications: false,
                appearance: false,
                [stateName]: true
            })
        }

    }

    useEffect(() => {
        validateUser();

        services.getData()
            .then((res) => {
                setNotificationsText(res.notificationsText);         
            })

    }, []);

    useEffect(() => {
    
        if(user) {
            getUserData();
        }

    }, [user.id]);

    useEffect(() => {
        let css = `::selection { background-color: ${color.color} }`;
        let style = document.querySelector('style');

        if (style) {
            style.innerHTML = css;
        } else {
            let head = document.head || document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            style.innerHTML = css;
            head.appendChild(style);
        }
    }, [activeTabs.appearance])

    return (

        <div className="d-flex settings">
            <div className="page__element">
                <h2 className="uk-modal-title">Настройки</h2>
                <p className="text-muted settings-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet dapibus felis, consequat dapibus sapien. Fusce libero tellus, ultrices et tempor nec, condimentum et mauris. Ut eget urna sed ligula dictum molestie. Sed mollis commodo suscipit.</p>
                
                <div className="settings-wrapper">

                    <div className="mount">
                        <ul className="settings-tabs d-flex" onClick={(e) => changeActiveElement(e)}>
                            <li className="uk-active tab" data-name="userData"><a href="#">Профиль</a></li>
                            <li className="tab" data-name="pwd"><a href="#">Пароль</a></li>
                            <li className="tab" data-name="notifications"><a href="#">Уведомления</a></li>
                            <li className="tab" data-name="appearance"><a href="#">Внешний вид</a></li>
                        </ul>
                    </div>

                    <div className="settings__profile-data">

                        {
                            user && activeTabs.userData ? <SettingsUserData user={user} getUserData={getUserData} setUser={setUser} /> : null
                        }

                        {
                            activeTabs.pwd ? <SettingsPass id={user.id} /> : null
                        }

                        {
                            notificationsText && activeTabs.notifications ? <SettingsNotification id={user.id} notificationsText={notificationsText}/> : null
                        }

                        {
                            activeTabs.appearance? <SettingsAppearance id={user.id} color={color} theme={theme} updateThemeStyles={updateThemeStyles} /> : null
                        }

                    </div>

                </div>

            </div>
        </div>
    );

  }
  