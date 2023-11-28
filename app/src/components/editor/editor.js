import '../../helpers/iframeLoader.js';
import axios from "axios";
import React, {useEffect, useState} from "react";
import authService from '../../services/authService.js';
import EditorPageN from '../pages/newEditor-page.js';
import Services from '../../services/services.js';

export default function Editor() {
    const [pageList, setPageList] = useState([]);
    const [backupList, setBackupList] = useState([]);

    const [currentPage, setCurrentPage] = useState('index.html');

    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState(false);
    const [loginLengthError, setLoginLengthError] = useState(false);

    const [userInfo, setUserInfo] = useState({
        auth: false,
        role: '',
        colour: '',
        theme: '',
        themeName: '',
        id: '',
        name: '',
        path: ''
    })

    const [notification, setNotification] = useState('');

    const authServices = new authService(); 
    const services = new Services();

    const updateThemeStyles = (theme, color) => {

        const promiseThen = new Promise((resolve, reject) => {
            setTimeout(() => {

                setUserInfo(userInfo => ({
                    ...userInfo,
                    theme: theme,
                    colour: color
                }))

                isLoaded();

            }, 1000);
        });
        
        isLoading();

        promiseThen
            .then((val) => {
            })
            .catch((err) => console.log(err))
    }

    const setCurrentImg = (e) => {

        setUserInfo(userInfo => ({
            ...userInfo,
            path: e.target.src
        }))

    }

    const isPageList = (res) => {

        setPageList(res)

    }

    const isBackUpsList = (res, pageName) => {

        setBackupList(res.filter(backup => {
            return backup.page === pageName;
        }))

    }

    const propLoadPagesList = () => {
        services.loadPageList(isPageList)
    }

    const propLoadBackUpsList = (pageName) => {
        services.loadBackUpsList(pageName, isBackUpsList)
    }

    const isLoading = () => {
        setLoading(true)
    }

    const isLoaded = () => {
        setLoading(false)
    }

    useEffect(() => {

        authServices.checkToken((isLog, isRole, isColour, isTheme, isId, isName) => {

            setUserInfo(userInfo => ({
                ...userInfo,
                auth: isLog,
                role: isRole,
                theme: isTheme,
                colour: isColour,
                id: isId,
                name: isName
            }))

            authServices.checkAuth();
                
            const {color, nameColor} = userInfo.colour;
            const {name, id} = userInfo.theme;
            const {
                additionalColour,
                background,
                panelColor,
                text,
                additionalBackground,
                additionalText,
                shadowNavBarTop
                }  = userInfo.theme.colorScheme;

            let css = `::selection { background-color: ${color} }`;
            let style = document.querySelector('style');

            if (style) {
                style.innerHTML = css;
            } else {
                let head = document.head || document.getElementsByTagName('head')[0];
                style = document.createElement('style');
                style.innerHTML = css;
                head.appendChild(style);
            }

            document.documentElement.style.setProperty('--background-color', background);
            document.documentElement.style.setProperty('--text-color', text);
            document.documentElement.style.setProperty('--panel-color', panelColor);
            document.documentElement.style.setProperty('--additional-color', additionalColour);
            document.documentElement.style.setProperty('--accent-color', color);
            document.documentElement.style.setProperty('--additional-background', additionalBackground);
            document.documentElement.style.setProperty('--additional-text', additionalText);
            document.documentElement.style.setProperty('--shadow-nav-bar', shadowNavBarTop);

        });

    }, [])

    useEffect(() => {
        axios
            .post('./api/checkEnableNotifications.php', {id: userInfo.id})
            // .get(`http://localhost:5000/notifications?id=${this.state.id}`)
            .then(res => {

                setNotification(res.data);

            })
            .catch((err) => console.log(err))
    }, [userInfo.id])

    useEffect(() => {
        authServices.checkToken((isLog, isRole, isColour, isTheme) => {
            setUserInfo(userInfo => ({
                ...userInfo, 
                auth: isLog,
                role: isRole
            }))
        });

    }, [userInfo.auth])

    useEffect(() => {

        try {
            const {color, nameColor} = userInfo.colour;
            const {name, id} = userInfo.theme;
            const {
                additionalColour,
                background,
                panelColor,
                text,
                additionalBackground,
                additionalText,
                shadowNavBarTop
                }  = userInfo.theme.colorScheme;

            let css = `::selection { background-color: ${color} }`;
            let style = document.querySelector('style');

            if (style) {
                style.innerHTML = css;
            } else {
                let head = document.head || document.getElementsByTagName('head')[0];
                style = document.createElement('style');
                style.innerHTML = css;
                head.appendChild(style);
            }

            document.querySelector('body').className = ``;
            document.querySelector('body').className = name;

            document.documentElement.style.setProperty('--background-color', background);
            document.documentElement.style.setProperty('--text-color', text);
            document.documentElement.style.setProperty('--panel-color', panelColor);
            document.documentElement.style.setProperty('--additional-color', additionalColour);
            document.documentElement.style.setProperty('--accent-color', color);
            document.documentElement.style.setProperty('--additional-background', additionalBackground);
            document.documentElement.style.setProperty('--additional-text', additionalText);
            document.documentElement.style.setProperty('--shadow-nav-bar', shadowNavBarTop);
        } catch(e) {}

    }, [userInfo.theme, userInfo.colour])


    return (

        <>

        <EditorPageN 
            auth={userInfo.auth} 
            role={userInfo.role} 
            loading={loading}
            pageList={pageList}
            backupList={backupList}
            // currentPage={currentPage}
            // virtualDom={this.virtualDom}
            // save={this.save}
            // init={this.init}
            // deletePage={this.deletePage}
            loadPageList={propLoadPagesList}
            loadBackUpsList={propLoadBackUpsList}
            // restoreBackup={this.restoreBackup}
            // multipleDelete={this.multipleDelete}
            color={userInfo.colour}
            theme={userInfo.theme}
            updateThemeStyles={updateThemeStyles}
            themeId={userInfo.theme.id}
            isLoading={isLoading}
            isLoaded={isLoaded}
            id={userInfo.id}
            notifications={notification}
            name={userInfo.name}
            // isImg={isImg}
        />

        </>

    )

}