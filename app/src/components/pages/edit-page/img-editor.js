import React, {useState, useEffect} from "react";
import axios from "axios";
import UIkit from "uikit";
import Services from "../../../services/services";

export default function ImgEditor({setCurrentImg, imageName, setNewImageName}) {

    const [mediaList, setMediaList] = useState([]);
    const [foldersList, setFoldersList] = useState([]);

    const [folder, setFolder] = useState('downloads');

    const services = new Services();

    const loadMediaList = (folder) => {

        services.loadMediaList(folder)
            .then(res => {
                setMediaList(res.files);
            })
            
    }

    const loadFoldersList = () => {

        services.loadFoldersList()
            .then(res => {
                setFoldersList(res.folders);
            })
    }

    const handleChange = event => {
        setFolder(event.target.value);
    };

    const setImage = (e) => {
        setNewImageName(e.target.src)
    }

    useEffect(() => {
        loadFoldersList();
        loadMediaList(folder);

        document.querySelector('#folders').addEventListener('change', (e) => {
            handleChange(e);
        })

        document.querySelector('.btn-add-new-img').addEventListener('click', (e) => {
            addNewImg(e);
        })

    }, []);

    const addNewImg = (e) => {

        let imgUploader = document.querySelector('#img-upload');

        imgUploader.click();

        imgUploader.addEventListener('change', (e) => {
            if(imgUploader.files && imgUploader.files[0]) {
                let formData = new FormData();
    
                formData.append('image', imgUploader.files[0]);
    
                services.postImage(formData)
                    .then((res) => {
                        UIkit.notification({message: 'Успешно загружено', status: 'success', pos: 'bottom-center'})
                    })
                    .catch(() => showNotifications('Ошибка загрузки', 'danger'))
                    .finally(() => {
                        imgUploader.removeEventListener('change', this.postImage);
                        imgUploader.value = '';
                    })
            }
        });

    }

    useEffect(() => {
        loadMediaList(folder);

        document.querySelectorAll('.media-modal__item').forEach(el => {
            el.removeEventListener('click', setImage);
            el.addEventListener('click', (e) => setImage(e));
        });

    }, [folder]);

    useEffect(() => {

        document.querySelectorAll('.media-modal__item').forEach(el => {
            el.removeEventListener('click', setImage);
            el.addEventListener('click', (e) => setImage(e));
        });

    }, [mediaList]);


    return (
        <>
            <h5>Редактор изображения</h5>
            <div className="file-name">
                <p>Имя файла</p>
                <span>{imageName}</span>
            </div>

            <div className="media-modal__content iframe-media__content">
                <select className="uk-select user-select" aria-label="Select" name="folders" onChange={(e) => handleChange(e)} value={folder} id="folders">
                {
                    foldersList.map((item) => {
                        return <option value={item} key={item} data-option>{item}</option>
                    })
                }
                </select>
                <ul className="content-container__files d-flex" id="media-modal__items">
                    {
                        mediaList.map((item, i) => {
                            return  <li key={i} className="media-modal__item">
                                        <a className="uk-link-heading" href="#"><img src={item} srcSet="" data-alt={item.split('/').pop()} alt={item.split('/').pop()} /></a>
                                    </li>
                        })
                    }
                </ul>
                <a href="#" className="btn-add-new-img btn">Добавить/выбрать новый файл</a>
            </div>
            <input type="file" name="" id="img-upload" accept="image/*" style={{display: 'none'}}/>
        </>
    )

}