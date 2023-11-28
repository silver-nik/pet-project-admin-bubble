import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import UIkit from "uikit";

import '../../helpers/iframeLoader.js';
import DOMHelper from '../../helpers/dom-helper.js';

import Spinner from '../spinner/spinner.js';
// import Panel from '../panel/panel.js';

import ConfirmModal from './main-page/confirm-modal.js';
import CreateModal from './pages-page/create-modal/create-modal.js';
import EditorMeta from '../editor/editor-meta/editor-meta.js';
// import CreateUserModal from '../create-usr-modal/create-user-modal.js';

import MediaEditor from "./media-page/media-editor.js";
import UserEditor from "./user-page/user-page.js";

import ChoosePage from "./pages-page/choose-modal.js";
import SettingsEditor from "./settings-page/settings-page.js";

import EditorText from '../editor/editor-text/editor-text.js';
import EditorImages from '../editor/editor-images/editor-images.js';

// Editor Iframe

import EditorIframe from "./edit-page/iframe-editor.js";

import Services from "../../services/services.js";

let virtualDom;
let iframe = document.querySelector('iframe');

export default function EditorPageN(props) {
    const [currentPage, setCurrentPage] = useState('index.html');
    const [visibilityNotifications, setVisibilityNotifications] = useState(true);

    const [openPage, setOpenPage] = useState({
        viewPublicPage: false,
        viewPagesPage: false,
        viewMediaPage: false,
        viewUserPage: false,
        viewEditorPage: false,
        settings: false,
    });

    const [image, setImage] = useState({
        imageName: '',
        imageElement: '',
        imageId: ''
    });

    const [newImageName, setNewImageName] = useState('');

    const [text, setText] = useState({
        textContent: '',
        elementText: '',
        idText: '',
        isLink: false
    });

    const [fontStyles, setFontStyles] = useState({
        font: '',
        fontWeight: '',
        size: 0
    })

    const [link, setLink] = useState({
        link: '',
        linkElement: '',
        idLink: '',
        linkText: ''
    })

    const resetData = () => {
        setText(text => ({
            ...text,
            textContent: ''
        }))

        setImage(image => ({
            ...image,
            imageName: ''
        }))

        setLink(link => ({
            ...link,
            link: ''
        }))
    }

    const services = new Services();

    const renderNotificatons = (data) => {
        if(data) {
            return Object.entries(data).map((([key, value]) => {
                return (
                    <>
    
                    <a className="dropdown-item preview-item" key={key}>
                        <div className="preview-thumbnail">
                        <div className="preview-icon bg-success">
                            <span uk-icon="info"></span>
                        </div>
                        </div>
                        <div className="preview-item-content">
                        <h6 className="preview-subject font-weight-normal">{value.title}</h6>
                        <p className="font-weight-light small-text mb-0 text-muted">
                            {value.body}
                        </p>
                        <p className="text-muted">{value.date}</p>
                        </div>
                    </a>
                    
                    </>
                )
            }));
        }
    }

    const transformPanel = () => {
        document.querySelector("#app").classList.toggle('icon-only');
    }

    const renderComponent = (name) => {
        setOpenPage(openPage => ({
            ...openPage,
            settings: false,
            viewPublicPage: false,
            viewPagesPage: false,
            viewMediaPage: false,
            viewUserPage: false,
            viewEditorPage: false,
            [name]: true
        }))
    }

    // запросы 

    const deletePage = (page, type = '') => {
        services.deletePage(page, type)
            .then(props.loadPageList)
            .then(() => props.loadBackUpsList(currentPage))
            .catch(() => {
                alert('Страницы не существует!');
            })
    }
    
    const multipleDelete = (arr, backupArr) => {
        services.multipleDelete(arr, backupArr)
            .then(res => console.log(res.data))
            .then(props.loadPageList)
            .then(props.loadBackUpsList(currentPage))
            .catch(() => {
                alert('Страницы не существует!');
            })
    }

    const restoreBackup = (e, backup, iframe) => {

        if(e) {
            e.preventDefault();
        }

        console.log(e);

        UIkit.modal.confirm("Вы действительно хотите восстановить страницу и зрезервной копии? Все изменения будут потеряны.", {i18n: {ok: 'Да, уверен', cancel: 'Нет, я передумал'}})
            .then(() => {
                props.isLoading();
                return services.restoreBackup(currentPage, backup)
            })
            .then(() => {
                open(currentPage, props.isLoaded, iframe)
            })
            .then(() => {
                props.isLoaded();
            })
    }

    // конец запросов

    const enableEditing = (iframe) => {
        iframe.contentDocument.body.querySelectorAll('text-editor').forEach(el => {

            const id = el.getAttribute('nodeid');

            const virtualElement = virtualDom.body.querySelector(`[nodeid="${id}"]`);
            
            new EditorText(el, virtualElement, setText, setLink, setFontStyles, resetData);
        })


        iframe.contentDocument.body.querySelectorAll('[editableimgid]').forEach(el => {

            let id = el.getAttribute('editableimgid');
            let virtualElement = virtualDom.body.querySelector(`[editableimgid="${id}"]`);

            new EditorImages(el, virtualElement, props.isLoading, props.isLoaded, setImage, resetData);
        })

    }

    const injectStyles = (iframe) => {
        const style = iframe.contentDocument.createElement('style');

        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
                cursor: pointer;
            }
            text-editor:focus {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            [editableimgid]:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
                cursor: pointer;
            }
        `

        iframe.contentDocument.head.appendChild(style);
    }

    const open = (pageName, callback, iframe) => {
        
        setCurrentPage(pageName);

        services.loadCurrentPage(pageName)
            .then(res => DOMHelper.parseStringToDOM(res))
            .then(DOMHelper.wrapTextNodes)
            .then(DOMHelper.wrapImages)
            .then(DOMHelper.wrapLinks)
            .then(dom => {
                virtualDom = dom;

                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => iframe.load('../temp-v345453430.html'))
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => enableEditing(iframe))
            .then(() => injectStyles(iframe))
            .then(() => props.loadBackUpsList(pageName))

            props.loadPageList();
            props.loadBackUpsList(pageName);
    }

    const readAllNotifications = () => {

        services.readAllNotifications(props.id)
            // .get(`http://localhost:5000/notifications?id=${state.id}`)
            .then(res => {
                setVisibilityNotifications(false);
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if(newImageName !== '') {
            const virtualElement = virtualDom.body.querySelector(`[editableimgid="${image.imageId}"]`);

            virtualElement.src = image.imageElement.src = newImageName;
        }
    }, [newImageName]);

    useEffect(() => {
        if(text.textContent) {
            const virtualElement = virtualDom.body.querySelector(`[nodeid="${text.idText}"]`);
            const element = document.querySelector("iframe").contentDocument.body.querySelector(`[nodeid="${text.idText}"]`);

            virtualElement.innerHTML = element.innerHTML = text.textContent.replace(/\n/g, "<br>");

            [virtualElement, element].forEach(el => {
                if(fontStyles.size !== 0 && fontStyles.size !== getComputedStyle(element).fontSize.replace(/[^0-9]/g, "")) {
                    el.style.fontSize = `${fontStyles.size}px`;
                } 
                
                if (fontStyles.font !== '') {
                    el.style.fontFamily = `${fontStyles.font}, sans-serif`;
                } 
                
                if (fontStyles.fontWeight !== '') {
                    el.style.fontWeight = `${fontStyles.fontWeight}`;
                }
            })
        }
    }, [text.textContent]);

    useEffect(() => {

        if(link.linkText !== '') {
            const virtualElement = virtualDom.body.querySelector(`[nodeid="${text.idText}"]`);
            const element = document.querySelector("iframe").contentDocument.body.querySelector(`[nodeid="${text.idText}"]`);

            if(element.closest('a')) {
                element.closest('a').href = link.link;
                virtualElement.closest('a').href = link.link;
            } else {
                if(link.linkText == '') {
                    virtualElement.innerHTML = element.innerHTML = text.textContent.replace(/\n/g, "<br>");
                } else {
                    virtualElement.innerHTML = element.innerHTML = link.linkText.replace(/\n/g, "<br>");
                }
            }
        }
    
    }, [link.linkText]);

    useEffect(() => {
        if(text.idText) {
            const virtualElement = virtualDom.body.querySelector(`[nodeid="${text.idText}"]`);
            const element = document.querySelector("iframe").contentDocument.body.querySelector(`[nodeid="${text.idText}"]`);
            [virtualElement, element].forEach(el => {

                if(fontStyles.size !== 0 && fontStyles.size !== getComputedStyle(element).fontSize.replace(/[^0-9]/g, "")) {
                    el.style.fontSize = `${fontStyles.size}px`;
                } 
                
                if (fontStyles.font !== '') {
                    el.style.fontFamily = `${fontStyles.font}, sans-serif`;
                } 
                
                if (fontStyles.fontWeight !== '') {
                    el.style.fontWeight = `${fontStyles.fontWeight}`;
                }
            })
        }
    }, [fontStyles]);

    useEffect(() => {
        if(props.notifications) {
            if(Object.keys(props.notifications).length > 0) {
                UIkit.notification({message: `У вас ${Object.keys(props.notifications).length} непрочитанных уведомлений`, pos: 'bottom-right', status:'warning'});
            }
        }
    }, [props.notifications]);

    useEffect(() => {
        renderComponent('viewEditorPage');
    }, [])


    const {
        loading, 
        pageList, 
        backupList, 
        auth, 
        role, 
        save, 
        init, 
        loadPageList, 
        color, 
        theme, 
        updateThemeStyles, 
        themeId, 
        isLoaded, 
        isLoading, 
        id, 
        name, 
        isImg, 
        loadBackUpsList,
        notifications
    } = props;

    let modal = true;

    let spinner;

    loading ? spinner = <Spinner active/> :  spinner = <Spinner/>

    return (
        <>

            {/* {spinner} */}

            <div>

                <nav className="navbar-top">
                    <div className="navbar-brand-wrapper d-flex">
                        <a href="index.html" className="navbar-brand brand-logo">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="1000.000000pt" height="212.000000pt" viewBox="0 0 1000.000000 212.000000"
                                preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,212.000000) scale(0.100000,-0.100000)"
                                fill="#000000" stroke="none">
                                <path d="M515 2109 c-166 -21 -469 -99 -498 -128 -5 -5 -6 -414 -2 -929 l8
                                -921 47 -20 c74 -32 207 -68 325 -87 137 -23 542 -27 674 -6 347 55 559 207
                                601 431 31 164 -25 346 -140 461 -54 54 -172 125 -240 143 -23 7 -20 9 31 30
                                81 34 123 62 169 114 79 91 118 217 106 351 -28 305 -249 499 -636 558 -103
                                15 -333 17 -445 3z m340 -608 c61 -28 87 -62 93 -120 6 -66 -2 -93 -39 -135
                                -38 -43 -121 -76 -193 -76 l-54 0 6 158 c2 86 6 159 8 160 8 10 83 31 109 31
                                17 0 48 -8 70 -18z m24 -639 c14 -10 36 -34 49 -52 30 -45 31 -138 1 -187 -37
                                -59 -131 -92 -224 -79 l-45 7 2 167 3 167 40 5 c59 8 145 -6 174 -28z"/>
                                <path d="M4040 2105 c-134 -19 -265 -49 -378 -87 l-97 -33 4 -925 c3 -667 7
                                -927 15 -932 58 -39 275 -95 446 -115 164 -19 489 -13 620 11 333 61 529 207
                                570 425 31 164 -25 346 -140 461 -54 54 -172 125 -240 143 -23 7 -20 9 31 30
                                81 34 123 62 169 114 121 137 141 367 49 559 -41 87 -138 186 -232 239 -88 48
                                -224 92 -346 110 -117 18 -342 18 -471 0z m370 -607 c60 -31 90 -77 90 -140 0
                                -27 -5 -59 -11 -71 -36 -69 -127 -117 -224 -117 l-54 0 6 158 c3 86 7 159 9
                                160 8 10 83 31 109 32 17 0 51 -10 75 -22z m26 -643 c18 -14 41 -39 49 -55 20
                                -38 19 -123 -1 -166 -31 -64 -132 -104 -229 -90 l-45 7 2 167 3 167 40 5 c67
                                9 143 -6 181 -35z"/>
                                <path d="M5780 2104 c-120 -16 -305 -61 -400 -97 l-65 -24 -3 -74 c-2 -41 -1
                                -457 3 -926 l7 -852 48 -20 c69 -30 202 -66 315 -87 79 -14 154 -18 355 -19
                                272 0 348 8 500 52 305 88 461 279 435 533 -19 189 -119 336 -282 417 -43 22
                                -89 43 -103 47 -25 7 -24 7 11 20 139 52 224 135 271 264 24 66 29 224 9 307
                                -34 140 -139 274 -274 350 -88 48 -224 92 -346 110 -119 18 -342 18 -481 -1z
                                m380 -606 c60 -31 90 -77 90 -140 0 -27 -5 -59 -11 -71 -36 -69 -127 -117
                                -224 -117 l-55 0 7 158 c3 86 7 159 9 160 8 10 83 31 109 32 17 0 51 -10 75
                                -22z m26 -643 c18 -14 41 -39 49 -55 20 -38 19 -123 -1 -166 -31 -64 -132
                                -104 -229 -90 l-45 7 2 167 3 167 40 5 c67 9 143 -6 181 -35z"/>
                                <path d="M7096 2058 c-5 -55 -48 -1990 -43 -1994 1 -1 108 6 237 16 129 10
                                395 31 590 46 213 16 359 31 366 38 9 9 65 542 64 609 0 16 -21 17 -291 17
                                l-290 0 5 53 c4 28 26 309 51 622 24 314 46 587 49 608 l4 37 -368 0 -369 0
                                -5 -52z"/>
                                <path d="M9110 2099 c-371 -57 -642 -351 -742 -808 -30 -133 -32 -416 -4 -541
                                76 -349 257 -588 526 -697 182 -73 450 -70 661 7 64 23 179 84 179 94 0 9 61
                                571 65 603 l6 42 -92 -56 c-293 -176 -476 -198 -614 -72 -57 53 -106 133 -90
                                147 16 15 680 105 862 118 l102 7 5 46 c33 279 -2 522 -105 730 -44 89 -65
                                118 -138 192 -94 94 -176 142 -299 174 -79 20 -237 27 -322 14z m193 -603 c66
                                -28 102 -91 113 -200 5 -53 4 -66 -7 -66 -8 0 -104 -9 -213 -20 -110 -11 -202
                                -17 -205 -15 -7 8 28 115 56 166 46 86 129 147 201 149 12 0 37 -6 55 -14z"/>
                                <path d="M2818 1975 c2 -41 -1 -174 -7 -297 -29 -571 -105 -908 -230 -1021
                                -34 -31 -48 -37 -84 -37 -74 0 -112 69 -127 234 -21 218 19 513 125 924 25 96
                                45 177 45 181 0 4 -145 11 -322 15 -178 4 -334 8 -347 9 -21 2 -26 -4 -37 -48
                                -20 -73 -61 -350 -76 -500 -6 -71 -12 -254 -12 -405 -1 -273 -1 -276 27 -363
                                76 -244 219 -427 403 -519 l87 -43 131 0 c122 0 135 2 189 27 32 15 72 39 89
                                53 17 14 33 24 35 21 3 -2 -1 -48 -7 -101 -6 -53 -9 -99 -7 -102 5 -4 569 35
                                574 41 2 1 19 187 38 412 58 674 141 1485 160 1570 4 20 2 20 -323 22 l-327 1
                                3 -74z"/>
                                </g>
                            </svg>
                        </a>
                        <a href="index.html" className="navbar-brand brand-logo-mini">
                            <img src="http://react-admin/img/Block1/logo.svg" alt="logo" srcSet="" />
                        </a>
                    </div>
                    <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
                        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" onClick={() => transformPanel()}>
                            <span className="icon-menu" uk-icon="menu"></span>
                        </button>
                        <ul className="navbar-nav mr-lg-2">
                            <li className="nav-item nav-search d-none d-lg-block">
                                <div className="input-group">
                                    <div className="input-group-prepend hover-cursor" id="navbar-search-icon">
                                        <span className="input-group-text" id="search">
                                            <span uk-icon="search"></span>
                                        </span>
                                        <input type="text" className="form-control" id="navbar-search-input" placeholder="Search now" aria-label="search" aria-describedby="search" />
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul className="navbar-nav navbar-nav-right d-flex">
                        <li className="nav-item dropdown">
                            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                            <span uk-icon="bell"></span>
                            {
                                notifications && Object.keys(notifications).length > 0 && visibilityNotifications ? 
                                    <span className="count">
                                        {
                                            notifications && Object.keys(notifications).length > 0 ? Object.keys(notifications).length : null
                                        }
                                    </span>
                                : null
                            }
                            </a>
                            {
                                notifications && Object.keys(notifications).length > 0 && visibilityNotifications ?
                                    <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown" uk-dropdown="mode: click">
                                        <p className="mb-0 font-weight-normal float-left dropdown-header">Уведомления</p>
                                        
                                        <div className="notifications__container">
                                        {

                                            notifications ? renderNotificatons(notifications) : null

                                        }
                                        </div>

                                        <ul className="notifications__active-btns">
                                            <li class="content-btn uk-active" role="presentation">
                                                <a href="#" aria-selected="true" role="tab" id="uk-switcher-127-tab-0" aria-controls="uk-switcher-127-tabpanel-0" onClick={(e) => readAllNotifications()}>Отметить прочитанными</a>
                                            </li>
                                        </ul>   

                                    </div>
                                : null
                            }
                        </li>
                        <li className="nav-item nav-profile dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" id="profileDropdown">
                                <img src="http://react-admin/img/downloads/user.jpg" alt="profile" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown" uk-dropdown="mode: click">
                                <a className="dropdown-item" onClick={(e) => {
                                    renderComponent('settings')
                                    document.querySelectorAll('.tabs-menu li').forEach(el => el.classList.remove('uk-active'))
                                }}>
                                    <span uk-icon="cog"></span>
                                    Settings
                                </a>
                                <a className="dropdown-item" onClick={() => services.logout()}>
                                    <span uk-icon="sign-out"></span>
                                    Logout
                                </a>
                            </div>
                        </li>
                        <li className="nav-item nav-settings d-none d-lg-flex">
                            <a className="nav-link" href="#">
                                <span uk-icon="more"></span>
                            </a>
                        </li>
                        </ul>
                        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                            <span className="icon-menu"></span>
                        </button>
                    </div>
                </nav>

            <div className="panel-wrapper"> 
                <div className='panel'>

                    <ul className="tabs-menu" uk-switcher="connect: .my-class; active: 1">


                        <li><a href="#" onClick={(e) => renderComponent('viewPublicPage')}>
                            <span uk-icon="home" uk-tooltip="Главная"></span>
                            <span className="panel-title">Главная</span>
                        </a></li>


                        <li><a href="#" onClick={(e) => renderComponent('viewEditorPage')}>
                            <span uk-icon="file-edit" uk-tooltip="Редактировать страницу"></span>
                            <span className="panel-title">Редактировать страницу</span>
                        </a></li>
                        <li><a href="#" onClick={(e) => renderComponent('viewPagesPage')}>
                            <span uk-icon="album" uk-tooltip="Страницы"></span>
                            <span className="panel-title">Страницы</span>
                        </a></li>
                        <li><a href="#" onClick={(e) => renderComponent('viewMediaPage')} className="media-ed"> 
                            <span uk-icon="image" uk-tooltip="Медиафайлы"></span>
                            <span className="panel-title">Медиафайлы</span>
                        </a></li>
                        <li><a href="#" onClick={(e) => renderComponent('viewUserPage')}>
                            <span uk-icon="users" uk-tooltip="Управление пользователями"></span>
                            <span className="panel-title">Управление пользователями</span>
                        </a></li>
                        <li className="exit-btn">
                            <a href="http://react-admin/" onClick={() => services.logout()}><span uk-icon="sign-out" uk-tooltip="Выход"></span><span className="panel-title">Выход</span></a>
                        </li>
                    </ul>

                </div>
                <div className="panel-rigth-side">
                    { !openPage.settings ?
                    <ul className="uk-switcher uk-margin my-class">
                        <li>
                            {
                                openPage.viewPublicPage ? <ConfirmModal modal={modal} target={'modal-save'} method={save} themeId={themeId} isLoaded={isLoaded} isLoading={isLoading} loading={loading} notifications={notifications} name={name} /> : null
                            }
                        </li>
                        <li>
                            <EditorIframe 
                                auth={auth} 
                                open={open} 
                                isLoading={isLoading} 
                                isLoaded={isLoaded} 
                                loadPageList={loadPageList} 
                                loadBackUpsList={loadBackUpsList} 
                                virtualDom={virtualDom} 
                                pageName={currentPage} 
                                iframe={iframe} 
                                imageName={image.imageName} 
                                setNewImageName={setNewImageName} 
                                textContent={text.textContent} 
                                setNewText={setText} 
                                setNewFontStyle={setFontStyles} 
                                defaultTextSize={fontStyles.size} 
                                setNewLink={setLink} 
                                link={link.link} 
                                isLink={text.isLink}
                            />
                        </li>
                        <li>
                            <div className="panel-block__wrapper d-flex block-2">
                                {
                                    openPage.viewPagesPage ? <ChoosePage modal={modal} target={'modal-pages'} data={pageList} redirect={open} del={deletePage} currentPage={currentPage} role={role} multiDelete={multipleDelete} iframe={iframe} /> : null
                                }
                                {
                                    openPage.viewPagesPage ? 

                                    <ul className="uk-switcher my-class-2">

                                        <li>
                                            <CreateModal modal={modal} target={'modal-create'} loadPageList={loadPageList}/>
                                        </li>
                                        <li>
                                            <ChoosePage modal={modal} target={'modal-backup'} data={backupList} redirect={restoreBackup} del={deletePage} multiDelete={multipleDelete} iframe={iframe} />
                                        </li>
                                        {virtualDom ? <EditorMeta modal={modal} target={'modal-meta'} virtualDom={virtualDom}/> : false}

                                    </ul> : null
                                }
                            </div>
                        </li>
                        <li>
                            {
                                openPage.viewMediaPage ? <MediaEditor modal={modal} isLoaded={isLoaded} isLoading={isLoading} loading={loading} /> : null
                            }
                        </li>
                        <li>
                            {
                                openPage.viewUserPage ? <UserEditor modal={modal} virtualDom={virtualDom} viewUserList={openPage.viewUserPage} id={id} /> : null
                            }
                        </li>
                    </ul>
                    : null
                    }

                    {
                        openPage.settings ? <SettingsEditor modal={modal} color={color} theme={theme} updateThemeStyles={updateThemeStyles} /> : null
                    }

                </div>
            </div>


            </div>

        </>
    )

}