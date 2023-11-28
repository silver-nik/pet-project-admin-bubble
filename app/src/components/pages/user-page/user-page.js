import React, { Component, useEffect, useState } from "react";
import UIkit from "uikit";
import EditorUser from "./editor-user/editor-user";

import CreateUserModal from "./create-user-modal/create-user-modal";

import { SkeletonUsersList } from "../../skeletons/user-page-skeleton";
import Services from "../../../services/services";

export default function UserEditor({id}) {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [viewCreateUserComponent, setViewCreateUserComponent] = useState(false);

    const [loadingUsersList, setLoadingUsersList] = useState(true);

    const services = new Services();

    const loadUsersList = () => {

        services.loadUsersList()
            .then(res => {
                console.log(res.users)
                setUsers(res.users)

                if(currentUser === null) {
                    setCurrentUser(res.users[0])
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadingUsersList(false);
                }, 4000)
            })
            
    }

    const setUserData = (e, item) => {

        document.querySelectorAll('.user-item').forEach(el => el.classList.remove('user-active'));

        e.target.closest('.user-item').classList.add('user-active');

        setCurrentUser(item);

    }

    const renderDataList = (data) => {

        return data.map((item, i) => {

            if(item.id !== id) {
                return (
                    <li className={ i == 0 ? "d-flex align-items-center py-3 border-bottom user-item user-active" : "d-flex align-items-center py-3 border-bottom user-item"} key={i} onClick={(e) => {
                        setUserData(e, item)
                    }}>
                        <img className="img-sm rounded-circle" src="http://react-admin/img/downloads/user.jpg" alt="profile" />
                        <div className="ms-3 user-info">
                            <h6 className="mb-1">{item.name}</h6>
                            <span className="mb-1 text-muted">{item.role.toLowerCase()}</span>
                            <small className="text-muted mb-0 country"><span uk-icon="location"></span>{item.country.toLowerCase()}</small>
                        </div>
                        <span uk-icon="chevron-right" className="arrow-right"></span>
                    </li>
                )
            }     

        }); 

    }

    useEffect(() => {
        loadUsersList();
    }, [])

    return (
        <>
            <div className="d-flex">
                <div className="page__element">
                    <h2 className="uk-modal-title">Пользователи</h2>
                    <a href="#" className="create-user-btn" onClick={(e) => setViewCreateUserComponent(!viewCreateUserComponent)}>
                        {
                            viewCreateUserComponent ? 'Вернуться к списку пользователей' : 'Создать нового пользователя'
                        }
                    </a>
                    {

                        viewCreateUserComponent ? 

                            <CreateUserModal loadUsersList={loadUsersList}/>
                    
                        : 

                        <div className="user d-flex">
                        
                            <div className="users-list">

                                <ul className="mount" uk-switcher="connect: .user-data">

                                    {   
                                        loadingUsersList ? <SkeletonUsersList/> :
                                        renderDataList(users)
                                    }

                                </ul>

                            </div>

                            {
                                currentUser ? 

                                <div className="user-data">

                                    <div className="mount">

                                        <div className="user-data__top d-flex">

                                            <img src="http://react-admin/img/downloads/user.jpg" className="rounded-circle img-md" alt="" />

                                            <ul className="user-data__small-info">
                                                <li>{currentUser.name} / <span className="text-muted">@{currentUser.id}</span></li>
                                                <li><span uk-icon="icon: user" className="user-icon"></span>{currentUser.role}</li>
                                                <li>
                                                
                                                    <span className={currentUser.status}>{currentUser.status}</span>
                                                    
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="user-data__body d-flex">

                                            <div className="user-data__main-info">
                                                <ul className="main-info">
                                                    <li>
                                                        <textarea name="" id="" cols="30" rows="10" className="text-muted user-mail uk-input"></textarea>
                                                    </li>
                                                    <li className="py-3"><span uk-icon="mail" className="user-icon"></span>{currentUser.email}</li>
                                                    <li className="py-3"><span uk-icon="receiver" className="user-icon"></span>{currentUser.phoneNumber}</li>
                                                    <li className="py-3"><span uk-icon="location" className="user-icon"></span>{currentUser.country}</li>
                                                    <li className="py-3"><span uk-icon="world" className="user-icon"></span>{currentUser.language}</li>
                                                    <li className="py-3 user-btns">
                                                        <a href="#" className="btn-prim">Данные входа</a>
                                                        <a href="#" className="btn-prim" onClick={(e) => {
                                                            UIkit.modal('#modal-user').show();
                                                        }}><span uk-icon="pencil"></span></a>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>

                                    </div>
                                
                                </div> : null
                            }
                            
                        </div>

                    }
                </div>

                {

                    currentUser && <EditorUser modal={true} target={'modal-user'} user={currentUser} loadUsersList={loadUsersList}/>

                }
            </div>

        </>
    )

}