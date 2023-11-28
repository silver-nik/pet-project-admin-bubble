import { Component } from "react";
import axios from "axios";

export default function Services() {

    const getResource = async (url) => {
        let res = await axios(url);

        console.log(res);

        if(res.statusText !== 'OK') {
            throw new Error(`Could not fetch, status: ${res.data.status}`);
        }

        return await res.data;
    }

    const postResource = async (url, data) => {
        let res = await axios.post(url, data);
        
        if(res.statusText !== 'OK') {
            throw new Error(`Could not fetch, status: ${res.data.status}`);
        }
    
        return await res.data;
    }

    const logout = () => {
        getResource('./api/logout.php')
            .then(() => {
                localStorage.removeItem('token');
                window.location.replace('/');
            })
    }

    const login = (password, login) => {
        return postResource('./api/login.php', {'password': password, 'login': login})
    }

    const loadPageList = (callback) => {
        getResource('./api/pageList.php')
            .then(res => {
                callback(res)
            })
    }

    const loadBackUpsList = (pageName, callback) => {
        getResource('./backups/backups.json')
            .then(res => {
                callback(res, pageName)
            })
    }

    const loadCurrentPage = (pageName) => {
        console.log(pageName);

        return getResource(`../${pageName}?rnd=${Math.random()}`)
    }

    const loadMediaList = (folder, imageName = '') => {
        return postResource('./api/mediaList.php', {
            'folderName': folder,
            'imageName': imageName
        })
    }

    const loadFoldersList = () => {
        return getResource('./api/mediaList.php')
    }

    const getFontOptions = () => {
        return getResource('./api/text-variety.json')
    }

    const getDataGraph = () => {
        return getResource('./api/data.json')
    }

    const getTemplates = () => { 
        return getResource('./api/templateList.php')      
    }

    const getData = () => {
        return getResource('./api/settings2.json') 
    }

    const getUserData = () => {
        return getResource('./api/settings.json') 
    }

    const loadUsersList = () => {
        return getResource('./api/usersList.php') 
    }

    const getVisualOptions = (url) => {
        return getResource(url)
    }

    // POST axios requests 

    const deletePage = (page, type = '') => {
        let data = {
            'name': page,
            'type': type
        }

        return postResource('./api/deletePage.php', data)
    }

    const multipleDelete = (arr, backupArr) => {
        let data = {
            'pageArray': arr,
            'backupArr': backupArr
        }
    
        return postResource('./api/multiDeletePage.php', data)
    }

    const restoreBackup = (currentPage, backup) => {
        let data = {
            'page': currentPage,
            'file': backup
        }
    
        postResource('./api/restoreBackup.php', data)
    }

    const readAllNotifications = (id) => {

        let data = {
            'id': id
        }

        return postResource('./api/editNotifications.php', data)

    }

    const postImage = (formData) => {
        return postResource('./api/uploadImage.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    const createNewPage = (newPageName, template) => {
        return postResource('./api/createNewPage.php', {
            "name": newPageName,
            "template": template
        })
    }

    const createUser = (data) => {
        return postResource("./api/createUser.php", data)
    }

    const postNotificationSettings = (data, id) => {
        return postResource('./api/updateUserData.php', {'notifications': data, 'id': id})
    }

    const postNewPwd = (newPwd, currentPwd, id) => {
        return postResource('./api/updateUserData.php', { newPwd: newPwd, oldPwd: currentPwd, id: id })
    }

    const postNewUserData = (user) => {
        return postResource('./api/updateUserData.php', user)
    }

    const postAppearance = (id, color, theme) => {
        return postResource('./api/updateAppearance.php', {
            "id": id,
            "currentAccentColor": color,
            "currentTheme": theme
        })
    }

    const validateData = (currentPwd, id) => {
        return postResource('./api/validPass.php', { "pwd": currentPwd, "id": id })
    }

    return { 
        logout,
        login,
        loadPageList,
        loadBackUpsList,
        getData,
        deletePage,
        multipleDelete,
        loadCurrentPage,
        readAllNotifications,
        restoreBackup,
        postImage,
        loadMediaList,
        loadFoldersList,
        getFontOptions,
        getDataGraph,
        getTemplates, 
        createNewPage,
        postNotificationSettings,
        validateData,
        postNewPwd,
        postNewUserData,
        postAppearance,
        getVisualOptions,
        getUserData,
        createUser,
        loadUsersList
    };

}