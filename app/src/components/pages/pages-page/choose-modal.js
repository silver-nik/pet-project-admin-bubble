import React, {useEffect, useState} from "react";
import { SkeletonPagesList } from "../../skeletons/pages-page-skeleton";

export default function ChoosePage({role, data, redirect, del, currentPage, multiDelete, iframe}) {

    const [mainPage, setMainPage] = useState('index.html'); // нужно прокинуть в props из editor.js
    const [loadingList, setLoadingList] = useState(true);

    let title = 'Cтраницы',
        listForDelete = [],
        listBackupsForDelete = [];

    let btnCollection;
    
    const dataList = (data) => {

        let iframe = document.querySelector('iframe');

        if(data.length == 0) {
            return (
                <li><span>Страницы не найдены</span></li>
            )
        }

        return data.map((item) => {

            if(item.time) {
                title = 'Восстановление из резервной копии';
                
                return (
                    <li key={item.file} className="backup-item">
                        <a 
                            className="uk-link-heading uk-modal-close" 
                            href="#"
                            onClick={(e) => redirect(e, item.file, iframe)} value={item.file}>Резервная копия от {item.time}</a>
                            <span uk-icon="trash" className="uk-margin-small-left pointer page-active-icon" onClick={(e) => del(item.file, 'backups')}></span>
                    </li>
                )
            } else {
                title = 'Cтраницы';
                return (
                    <li key={item}>
                        <a 
                            className="uk-link-heading uk-modal-close" 
                            href="#"
                            onClick={(e) => {
                                redirect(item, null, iframe);
                            }} value={item}>{item}</a>
                            {item !== mainPage && item !== currentPage ? 
                                <span uk-icon="trash" className="uk-margin-small-left pointer page-active-icon" onClick={(e) => del(item)}></span> : false}
                            {item == currentPage ? 
                                <span uk-icon="code" className="uk-margin-small-left pointer page-active-icon" uk-toggle="target: #modal-meta"></span> : false}
                    </li>
                )
            }
        });
    }

    const setBtns = (e) => {

        // e.preventDefault();

        document.querySelectorAll('.delete-all').forEach(el => el.style.display = 'block');

        let pagesList = e.target.parentElement.closest('.page__top-nav').nextElementSibling;

        if(pagesList && pagesList.classList.contains('uk-list')) {
            
            let pageListArr = pagesList.querySelectorAll('.uk-list li');

            pageListArr.forEach((page, i) => {

                if(!page.querySelector('.uk-checkbox')) {

                    if(page.classList.contains("backup-item")) {
                        page.innerHTML += `<input class="uk-checkbox multiple__delete-btn backup-checkbox" type="checkbox" id=${i} value=${page.querySelector('a').getAttribute('value')}>`;
                    } else {
                        page.innerHTML += `<input class="uk-checkbox multiple__delete-btn" type="checkbox" id=${i} value=${page.querySelector('a').getAttribute('value')}>`;
                    }

                } else {
                    page.querySelector('.uk-checkbox').remove();
                    listForDelete = [];
                    listBackupsForDelete = [];
                    document.querySelectorAll('.delete-all').forEach(el => el.style.display = 'none')
                }
            })

        }


        const selectItems = document.querySelectorAll('.multiple__delete-btn');   

        selectItems.forEach(el => {
            el.addEventListener('click', (e) => {

                if(e.target.checked) {

                    if(e.target.classList.contains("backup-checkbox")) {
                        listBackupsForDelete.includes(e.target.value) ? null : listBackupsForDelete.push(e.target.value)
                    } else {
                        listForDelete.includes(e.target.value) ? null : listForDelete.push(e.target.value)
                    };

                } else {
          
                    listForDelete = listForDelete.filter((name) => name !== e.target.value);

                }

            })
        }) 

    }

    useEffect(() => {
        dataList(data);

        setTimeout(() => {
            setLoadingList(false);
        }, 2000)
    }, [data]);


    role == 'admin' ? btnCollection = 

        <ul className="uk-subnav btn-collection" uk-switcher="connect: .my-class-2">
            <li className="content-btn"><a href="#">Создать страницу</a></li>
            <li className="content-btn"><a href="#">Воссатновить</a></li>
        </ul>
                
    : '';
        
    return (
        <div className="page__element page__element-pages">
            <div className="mount">
                <div className="page__top-nav">
                    <h2 className="uk-modal-title">{title}</h2>
                    <div className="user-activities">
                        <button className="delete-all" onClick={(e) => multiDelete(listForDelete, listBackupsForDelete)} uk-tooltip="Удалить выбранные элементы"><span uk-icon="trash"></span></button>
                        <button className="btn-delete" onClick={(e) => setBtns(e)} uk-tooltip="Выбрать несколько элементов"><span uk-icon="bookmark"></span></button>
                    </div>
                </div>
                <ul className="uk-list uk-list-divider">
                    {
                        loadingList ? <SkeletonPagesList/> :
                        dataList(data)
                    }
                </ul>
                {btnCollection}
            </div>
        </div>
    )

}