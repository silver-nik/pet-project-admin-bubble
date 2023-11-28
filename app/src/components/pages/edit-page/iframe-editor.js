import '../../../helpers/iframeLoader.js';
import showNotifications from '../../../helpers/notifications.js';
import DOMHelper from '../../../helpers/dom-helper.js';

import axios from "axios";
import React, {useEffect, useState} from "react";

import TextEditor from './text-editor.js';
import ImgEditor from './img-editor.js';

import Spinner from '../../spinner/spinner.js';


let virtualDom;
let iframe;

export default function EditorIframe({auth, open, isLoading, isLoaded, loadPageList, loadBackUpsList, virtualDom, pageName, imageName, setNewImageName, textContent, setNewText, setNewFontStyle, defaultTextSize, setNewLink, link, isLink}) {

    const [activeComponent, setActiveComponent] = useState({
        'textEditor': false,
        'imgEditor': false,
        'linkEditor': false
    })
    
    const [loadingIframe, setLoadingIframe] = useState(true);

    const init = (e, pageName) => {

        isLoading();
        let iframe = document.querySelector('iframe');
        open(pageName, isLoaded, iframe);
        loadPageList();
        loadBackUpsList(pageName);

    }

    const save = () => {

        console.log(virtualDom);

        isLoading();
        const newDom = virtualDom.cloneNode(virtualDom);

        DOMHelper.unwrapTextNodes(newDom);
        DOMHelper.unwrapImages(newDom);
        DOMHelper.unwrapLinks(newDom);


        const domToHtml = DOMHelper.serializeDOMToString(newDom);

        axios
            .post("./api/savePage.php", {pageName: pageName, html: domToHtml})
            .then(() => showNotifications({message: 'Успешно сохранено', status: 'success'}))
            .catch(() => showNotifications({message: 'Ошибка сохранения', status: 'danger'}))
            .finally(isLoaded);
        
        loadPageList();
        loadBackUpsList(pageName);
    }

    useEffect(() => {
       
        if(textContent !== '') {
            setActiveComponent(activeComponent => ({
                ...activeComponent,
                'imgEditor': false,
                'textEditor': true,
                'linkEditor': false
            }))   
            
            setTimeout(() => {
                let iframeEditor = document.querySelector('.tabs-menu.iframe-menu__editor');

                iframeEditor.classList.add('open');
            }, 100)

        }

    }, [textContent]);

    useEffect(() => {
       
        if(imageName !== '') {
            setActiveComponent(activeComponent => ({
                ...activeComponent,
                'textEditor': false,
                'imgEditor': true,
                'linkEditor': false
            }))

            setTimeout(() => {
                let iframeEditor = document.querySelector('.tabs-menu.iframe-menu__editor');

                iframeEditor.classList.add('open');
            }, 100)

        }         

    }, [imageName]);

    useEffect(() => {
        let iframeEditor = document.querySelector('.tabs-menu.iframe-menu__editor');
        iframeEditor.classList.remove('open');

    }, [activeComponent]);

    useEffect(() => {
        init(null, pageName);

        setTimeout(() => {
            setLoadingIframe(false);
        }, 3000)
    }, []);

    let spinner;

    loadingIframe ? spinner = <Spinner active/> :  spinner = <Spinner/>

    return (
        <>
            {spinner}
            <div className="content-editor__menu">
                <button className="content-btn btn-accept" type="button" onClick={(e) => {
                    e.preventDefault();

                    document.querySelector('.content-editor__activities').classList.toggle('content-editor__open-menu');

                }} uk-scrollspy="cls: uk-animation-fade;" uk-scrollspy-class="uk-animation-slide-top">
                    <span uk-icon="thumbnails" className="uk-icon"></span>
                </button>
                <ul className='content-editor__activities'>
                    <li>
                        <div className="preview-icon bg-success" uk-tooltip="Опубликовать" onClick={() => save()}>
                            <span uk-icon="push" className="uk-icon">
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <iframe id="frame" src="" style={{border: 0}}></iframe>
            <input type="file" name="" id="img-upload" accept="image/*" style={{display: 'none'}}/>
            <div className="tabs-menu iframe-menu__editor">
                <span className="menu-close" uk-icon="close" onClick={(e) => document.querySelector('.iframe-menu__editor').classList.remove('open')}></span>
                {
                   activeComponent.textEditor ? <TextEditor textContent={textContent} setNewText={setNewText} setNewFontStyle={setNewFontStyle} defaultTextSize={defaultTextSize} link={link} setNewLink={setNewLink} isLink={isLink}/> : null
                }
                {
                   activeComponent.imgEditor ? <ImgEditor imageName={imageName} setNewImageName={setNewImageName} /> : null
                }
            </div>
        </>
    )
}