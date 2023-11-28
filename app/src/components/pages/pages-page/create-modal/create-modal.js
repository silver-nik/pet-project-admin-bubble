import React, { useEffect, useState } from "react";
import UIkit from "uikit";
import Services from "../../../../services/services";

export default function CreateModal({loadPageList}) {
    const [newPageName, setNewPageName] = useState('');
    const [template, setTemplate] = useState('');
    const [templateList, setTemplateList] = useState([]);

    const services = new Services();

    const changePageName = (value) => {

        let newPageName = value.replace(/\s/g,'');

        if(newPageName.match(/^[a-zA-Z0-9]+$/)) {   
            setNewPageName(newPageName);
        } else {
            UIkit.notification.closeAll();

            UIkit.notification({message: 'Неправильное имя страницы. Проверьте на правильность, не может включать символы и кириллицу', status: 'danger', pos: 'bottom-center'})
        }

    }

    const getTemplates = () => {
        services.getTemplates()
            .then(res => {
                setTemplateList(res);
            })        
    }

    const setDataList = (data) => {
        return data.map((item, i) => {
            return (
                <option value={item} key={i}>{item}</option>
            )
        });
    }

    const createNewPage = () => {
        services.createNewPage(newPageName, template)
            .then(() => {
                setNewPageName('');
                setTemplate('');
            })
            .then(loadPageList)
            .then(() => {   
                UIkit.notification({message: 'Успешно сохранено', status: 'success', pos: 'bottom-center'})})
            .catch(() => {
                UIkit.notification({message: 'Ошибка сохранения, такая страница уже существует', status: 'danger', pos: 'bottom-center'})
            })
    }

    useEffect(() => {
        getTemplates();
    }, [])

    return (
        <div className="page__element page__element-create">
            <div className="mount form-create">
                <h2 className="uk-modal-title">Введите название новой страницы</h2>
                <input className="uk-input" type="text" value={newPageName} onChange={(e) => {
                        changePageName(e.target.value);
                    }}></input>
                <p>Укажите шаблон страницы</p>
                <select className="uk-select" aria-label="Select" name="template" value={template} onChange={(e) => {
                    setTemplate(e.target.value);
                }}> 
                    <option></option>
                    {setDataList(templateList)}
                </select>
                <button 
                    className="uk-button uk-margin-small-right uk-margin-small-top" 
                    type="button" 
                    onClick={() => createNewPage()}>Сохранить  страницу</button>
            </div>
        </div>
    )

} 