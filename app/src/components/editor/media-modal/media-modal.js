import React, {useState, useEffect} from "react";
import axios from "axios";
import UIkit from "uikit";
import Services from "../../../services/services";

export default function MediaModal({setCurrentImg, addNewImg}) {

    const [mediaList, setMediaList] = useState([]);
    const [foldersList, setFoldersList] = useState([]);

    const [folder, setFolder] = useState('downloads');

    const services = new Services();

    const loadMediaList = (folder) => {

        services.loadMediaList(folder)
            .then(res => {
                setMediaList(res.data.files);
            })
            .finally(() => {
                setTimeout(() => {
                    // setLoadingImages(false)
                }, 4000)
            })
    }

    const loadFoldersList = () => {

            services.loadFoldersList()
                .then(res => {
                    setFoldersList(res.data.folders);
                })
                // .finally(() => setLoadingTabs(false))
        // }, 4000)
    }

    const handleChange = event => {
        setFolder(event.target.value);
    };

    useEffect(() => {
        loadFoldersList();
        loadMediaList(folder);

        document.querySelector('#folders').addEventListener('change', (e) => {
            handleChange(e);
        })

        document.querySelector('.btn-add-new-img').addEventListener('click', (e) => {
            addNewImg();
        })

        UIkit.modal('#media-modal').show();

    }, []);

    useEffect(() => {
        loadMediaList(folder);

        document.querySelectorAll('.media-modal__item').forEach(el => {
            el.removeEventListener('click', setCurrentImg);
            el.addEventListener('click', setCurrentImg);
        });

    }, [folder]);

    useEffect(() => {

        document.querySelectorAll('.media-modal__item').forEach(el => {
            el.removeEventListener('click', setCurrentImg);
            el.addEventListener('click', setCurrentImg);
        });

    }, [mediaList]);


    return (
        <div id="media-modal" uk-modal={'true'}>
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Выберите изображение или загрузите новое</h2>
                <div className="media-modal__content">
                    <select className="uk-select user-select" aria-label="Select" name="folders" value={folder} id="folders">
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
            </div>
        </div>
    )

}