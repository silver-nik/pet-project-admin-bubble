import React, { useState, useEffect } from "react";
import { SkeletonMediaImg, SkeletonMediaTabs } from "../../skeletons/media-page-skeleton";
import Services from "../../../services/services";

export default function MediaEditor({isLoaded, isLoading, loading}) {
    const [foldersList, setFoldersList] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [section, setSection] = useState('folders');
    const [image, setImage] = useState('');
    const [folder, setFolder] = useState('');
    const [data, setData] = useState({
        name: '',
        alt: '',
        date: null,
        size: 0,
        type: null
    })

    const [loadingImages, setLoadingImages] = useState(true);
    const [loadingTabs, setLoadingTabs] = useState(true);

    const services = new Services();

    const loadMediaList = (folder) => {

        document.querySelectorAll('.folder-item').forEach(el => {
            if(el.getAttribute('value') === folder) {
                el.classList.add('active');
            }
        })

        services.loadMediaList(folder)
            .then(res => {
                setMediaList(res.files);
                setSection('files');
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadingImages(false)
                }, 4000)
            })
    }

    const loadFoldersList = () => {
        setLoadingTabs(true);

        setTimeout(() => {
            services.loadFoldersList()
                .then(res => {
                    setFoldersList(res.folders);
                    setSection('folders');
                    setFolder(res.folders[0]);
                })
                .finally(() => setLoadingTabs(false))
            }, 4000)
    }

    const formatBytes = (bytes, decimals) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const modifyMedia = (e) => {

        e.preventDefault();

        let target = e.target.closest('li.folder-item');

        const imageName = target.querySelector('img').getAttribute('data-alt'); 

        setImage(imageName);

        let images = document.querySelectorAll('.folder-item');

        images.forEach(img => {
            img.classList.remove('activeImg');
        })

        target.classList.add('activeImg');

        services.loadMediaList(folder, imageName)
            .then(res => {
                
                const {size, timeLoad, type} = res; 
                
                setData(data => ({
                    ...data,
                    name: imageName,
                    alt: target.querySelector('img').getAttribute('alt'),
                    date: timeLoad,
                    size: formatBytes(size),
                    type: type
                }))

                document.querySelector('.menu-editor').classList.add('open');

            })
   
    }

    const setFolderList = (data) => {

        return data.map((item, i) => {
            return (
                <li key={item} className="folder-item" value={item} onClick={(e) => {

                    e.preventDefault();

                    document.querySelectorAll('.folder-item').forEach(el => {
                        el.classList.remove('active');
                        el.classList.remove('activeImg');
                    })

                    document.querySelector('.menu-editor').classList.remove('open');

                    e.target.closest('.folder-item').classList.add('active');

                    loadMediaList(item);

                    setImage('');
                    setFolder(item);
                }}>
                    <a 
                        className="uk-link-heading uk-modal-close" 
                        href="#"
                        value={item}>{item}</a>
                </li>
            )
        });
    
    }

    const setMedia = (data) => {

        return data.map((item, i) => {
        
            return (
                <li key={i} className="folder-item" onClick={(e) => modifyMedia(e)}>
                    <a 
                        className="uk-link-heading uk-modal-close" 
                        href="#"
                        >
                            <img src={item} srcSet="" data-alt={item.split('/').pop()} alt={item.split('/').pop()} />
                    </a>
                </li>
            )
            
        });
        
    }

    useEffect(() => {
        loadMediaList(folder);
    }, [foldersList]);

    useEffect(() => {
        loadFoldersList();
    }, []);

    return (
        <div className="d-flex">
            <div className="page__element">
                <h2 className="uk-modal-title">Медиафайлы</h2>
                <div className="media__wrapper">
                {
                    loadingTabs ? <SkeletonMediaTabs/> :
                        
                    <ul className="content-container">
                        {
                            foldersList.length > 0 ? setFolderList(foldersList) : 'Файлов не найдено'
                        }
                    </ul>

                }
                
                {

                    loadingImages ? <SkeletonMediaImg/> : 
                    
                    <ul className="content-container__files">
                        {
                            mediaList.length > 0 ? setMedia(mediaList) : null
                        }
                    </ul>

                }
                </div>
            </div>
            <input type="file" name="" className="img-upload" accept="image/*" style={{display: 'none'}}/>
            <div className="tabs-menu menu-editor">
                <span className="menu-close" uk-icon="close" onClick={(e) => document.querySelector('.menu-editor').classList.remove('open')}></span>
                <h5>Редактор изображения</h5>
                <div className="file-name">
                    <p>Имя файла</p>
                    <span>{image}</span>

                </div>
                <div className="file-alt">
                    <p>Название</p>
                    <span>{data.alt}</span>
                </div>

                <div className="file-content">
                    <div className="file-type d-flex">
                        <p>Тип файла:</p>
                        <span>{data.type}</span>
                    </div>
                    <div className="file-date d-flex">
                        <p>Загружен:</p>
                        <span>{data.date}</span>
                    </div>
                    <div className="file-size d-flex">
                        <p>Размер файла:</p>
                        <span>{data.size}</span>
                    </div>
                </div>
            </div>
        </div>
    )

}