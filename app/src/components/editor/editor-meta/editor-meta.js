import React, {useEffect, useState} from "react";

export default function EditorMeta({modal, target, virtualDom}) {
    const [meta, setMeta] = useState({
        title: '',
        keywords: '',
        description: ''
    })

    let title = virtualDom.head.querySelector('title') || virtualDom.head.appendChild(virtualDom.createElement('title')),
            keywords = virtualDom.head.querySelector('meta[name="keywords"]'),
            description = virtualDom.head.querySelector('meta[name="description"]');

    const getMeta = (virtualDom) => {

        if(!keywords) {
            keywords = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            keywords.setAttribute('name', 'keywords');
            keywords.setAttribute('content', '');
        }

        if(!description) {
            description = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            description.setAttribute('name', 'description');
            description.setAttribute('content', '');
        }

        setMeta(meta => ({
            ...meta,
            title: title.innerHTML,
            keywords: keywords.getAttribute('content'),
            description: description.getAttribute('content')
        }))

    }

    const applyMeta = () => {
        title.innerHTML = meta.title;
        keywords.setAttribute('content', meta.keywords)
        description.setAttribute('content', meta.description)
    }

    const onValueChange = (e) => {

        if(e.target.getAttribute('data-title')) {
            e.persist();

            setMeta(meta => ({
                ...meta,
                title: e.target.value
            }))
        } else if(e.target.getAttribute('data-descr')) {
            e.persist();

            setMeta(meta => ({
                ...meta,
                description: e.target.value
            }))            
        } else if(e.target.getAttribute('data-key')) {
            e.persist();

            setMeta(meta => ({
                ...meta,
                keywords: e.target.value
            }))
        }

    }

    useEffect(() => {
        getMeta(virtualDom);
    }, [virtualDom])

    return (
        <div id={target} uk-modal={modal.toString()} container="false">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Редактирование meta-тэгов</h2>

                <form action="">
                    <div className="uk-margin">
                        <div className="uk-form-controls">
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="Title" data-title value={meta.title} onChange={(e) => onValueChange(e)}/>
                        </div>
                    </div>
                    <div className="uk-margin">
                        <textarea className="uk-textarea" rows="5" placeholder="Description" aria-label="Description" data-descr value={meta.description} onChange={(e) => onValueChange(e)}></textarea>
                    </div>
                    <div className="uk-margin">
                        <textarea className="uk-textarea" rows="5" placeholder="Keywords" aria-label="Keywords" data-key value={meta.keywords} onChange={(e) => onValueChange(e)}></textarea>
                    </div>
                </form>

                <button className="uk-button uk-button-danger uk-margin-small-right uk-modal-close" type="button">Отменить</button>
                <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => {applyMeta()}}>Сохранить</button>
            </div>
        </div>
    )
}