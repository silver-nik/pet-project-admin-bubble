import React, { useEffect, useState } from "react";
import Services from "../../../../services/services";

export default function SettingsNotification({id, notificationsText}) {

    const [emailNotification, setEmailNotification] = useState({
        name: 'email-notification'
    }); 
    const [pushNotification, setPushNotification] = useState({
        name: 'push-notification'
    });

    const services = new Services();
    
    const renderCheckboxes = (obj) => {

        return Object.entries(obj).map(([notifyKey, notifyValue], i) => {

            if(notifyKey !== 'name') {
                return (
                    <li key={i}>
                        <input 
                            type="checkbox" 
                            name="" 
                            id="" 
                            data-toggler={notifyKey}
                            defaultChecked={notifyValue}
                            onChange={(e) => {
                                if(obj == emailNotification) {
                                    dynamicChangeStateValue(setEmailNotification, notifyKey, !notifyValue)
                                } else if(obj == pushNotification) {
                                    dynamicChangeStateValue(setPushNotification, notifyKey, !notifyValue)
                                }
                            }}
                        />
                        <div className="notification__checkbox-info">
                            <span>{notificationsText[notifyKey]['title']}</span>
                            <span className="text-muted">{notificationsText[notifyKey]['description']}</span>
                        </div>
                    </li>
                )
            }

        })

    }

    const postNotificationSettings = (...data) => {

        services.postNotificationSettings(data, id)
            .then(res => {
                console.log(res.data);
                if(res.data === 200) {
                }
            })
    }

    const dynamicChangeStateValue = (stateCaller, key, value) => {
        stateCaller(prevState => ({
            ...prevState,
            [key]: value
        }))
    } 

    useEffect(() => {

        services.getData()
            .then((res) => {
                res.notifications.map(el => {
                    if(el.id == id) {
                        Object.keys(el).forEach(key => {
                            if(key !== 'id') {
                                
                                if(key === 'email-notification') {
                                    Object.entries(el[key]).forEach(([key, value]) => {
                                        dynamicChangeStateValue(setEmailNotification, key, value);
                                    })
                                } else if (key === 'push-notification') {
                                    Object.entries(el[key]).forEach(([key, value]) => {
                                        dynamicChangeStateValue(setPushNotification, key, value);
                                    })
                                }
    
                            }
                        })
                    }
                })
            })
    }, [id])


    return (

        <div className="user-notifications">

            <div className="user-data__body d-flex">

                <div className="mount">

                    <div className="user-data__main-info">
                        <div className="personal__wrapper">
                            <h6>Уведомления</h6>
                            <p>Мы все еще будем присылать вам важные уведомления касающиеся вашего аккаунта</p>
                        </div>
                        <ul className="pass-data d-flex">
                            
                            <li className="d-flex">
                                <div className="email-notification">
                                    <h6>Email уведомления</h6>
                                    <p>Узнавайте что происходит, когда вы не онлайн. Здесь вы можете их отключить</p>
                                </div>
                                <ul className="d-flex toggles">
                                    {renderCheckboxes(emailNotification)}
                                </ul>
                            </li>

                            <li className="d-flex">
                                <div className="email-notification">
                                    <h6>Push уведомления</h6>
                                    <p>Узнавайте что происходит, когда вы онлайн</p>
                                </div>
                                <ul className="d-flex toggles">
                                    {renderCheckboxes(pushNotification)}
                                </ul>
                            </li>

                        </ul>
                    </div>

                    <div className="btn-collection d-flex">

                        <button className="uk-button" onClick={(e) => {
                            postNotificationSettings(emailNotification, pushNotification);
                        }}>Сохранить изменения</button>

                    </div>

                </div>

            </div>

        </div>
        
    );

}