import React, {useState, useEffect} from "react";
import * as ReactDOMServer from 'react-dom/server';
import Services from "../../../services/services";


export default function TextEditor({textContent, setNewText, setNewFontStyle, defaultTextSize, link, setNewLink, isLink}) {

    const [fontFamilies, setFontFamilies] = useState();
    const [fontWeight, setFontWeight] = useState();

    const [temporaryFontStyle, setFontStyle] = useState({
        font: '',
        fontWeight: '',
        size: defaultTextSize  
    })

    const services = new Services();

    useEffect(() => {
        getFontOptions();

        console.log(document.querySelector("#text-editor__area"));
        document.querySelector("#text-editor__area").value = textContent;

        window.addEventListener("click", function (e) {
            if (e.target.closest(".wrapper-dropdown") === null) {
              closeAllDropdowns();
            }
        });

        setEventListenerToSelect();

    }, []);

    const closeAllDropdowns = () => {
        const selectedAll = document.querySelectorAll(".wrapper-dropdown");
        selectedAll.forEach((selected) => {
            const optionsContainer = selected.children[2];
            let arrow = selected.children[1];
        
            handleDropdown(selected, arrow, false);
        });
    }
      
    const handleDropdown = (dropdown, arrow, open) => {
        if (open) {
            arrow.classList.add("rotated");
            dropdown.classList.add("active");
        } else {
            arrow.classList.remove("rotated");
            dropdown.classList.remove("active");
        }
    }

    const setEventListenerToSelect = () => {
        const selectedAll = document.querySelectorAll(".wrapper-dropdown");

        selectedAll.forEach((selected) => {
            const optionsContainer = selected.children[2];
            const optionsList = selected.querySelectorAll("div.wrapper-dropdown li");

            selected.addEventListener("click", () => {
                let arrow = selected.children[1];

                if (selected.classList.contains("active")) {
                    handleDropdown(selected, arrow, false);
                } else {
                    let currentActive = document.querySelector(".wrapper-dropdown.active");

                    if (currentActive) {
                        let anotherArrow = currentActive.children[1];
                        handleDropdown(currentActive, anotherArrow, false);
                    }

                    handleDropdown(selected, arrow, true);
                }
            });

            for (let o of optionsList) {
                o.addEventListener("click", () => {
                    if(o.getAttribute('data-font') === 'font') {
                        setFontStyle(temporaryFontStyle => ({
                            ...temporaryFontStyle,
                            font: o.innerHTML
                        }))
                    } else if (o.getAttribute('data-font') === 'weight') {
                        setFontStyle(temporaryFontStyle => ({
                            ...temporaryFontStyle,
                            fontWeight: o.innerHTML
                        }))
                    }

                    selected.querySelector(".selected-display").innerHTML = o.innerHTML;
                });
            }
        });
    }

    const getFontOptions = () => {
        services.getFontOptions()
            .then(res => {
                setFontFamilies(res['font-family']);
                setFontWeight(res['font-style']);
            })
    }

    const setFontOptions = (data, dataAttr) => {
        return data.map((item, i) => {
            return <li className="item" key={i} data-font={dataAttr}>{item}</li>
        })
    }

    useEffect(() => {
        setEventListenerToSelect();
    }, [fontFamilies, fontWeight])

    useEffect(() => {
        setNewFontStyle(fontStyle => ({
            ...fontStyle,
            font: temporaryFontStyle.font,
            fontWeight: temporaryFontStyle.fontWeight,
            size: temporaryFontStyle.size
        }))
    }, [temporaryFontStyle])

    useEffect(() => {
        setFontStyle(temporaryFontStyle => ({
            ...temporaryFontStyle,
            size: defaultTextSize
        }))
    }, [defaultTextSize])


    const setAndEditLink = (e) => {
        e.preventDefault();

        const textarea = document.querySelector('textarea');
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        const links = document.querySelector('.link-editor__editor input').value;
        const wrappedText = React.createElement('a', { href: links }, selectedText);
        const wrappedTextString = ReactDOMServer.renderToString(wrappedText);
        const newText = textarea.value.slice(0, textarea.selectionStart) + wrappedTextString + textarea.value.slice(textarea.selectionEnd);

        if(links == '') {
            setNewLink({
                linkText: selectedText
            })
        } else {
            setNewLink({
                linkText: newText,
                link: links
            })
        }

        document.querySelector('.link-editor__editor input').value = '';
    }



    return (
        <>
            <h5>Редактор текста</h5>
            <div className="file-name">
                <p>Текущий текст</p>
                <textarea name="" id="text-editor__area" cols="30" rows="10" value={textContent} onInput={(e) => setNewText(text => ({
                    ...text,
                    textContent: e.target.value
                }))} />
                <span className="text-editor__link-editor icon-margin" uk-icon="link" onClick={(e) => {
                    document.querySelector('.link-editor__editor').classList.toggle('link-editor__open');
                }}></span>
                <div className="link-editor__editor">
                    <span className="text-editor__link-editor link-editor__save-btn" uk-icon="pencil" onClick={(e) => {
                        setAndEditLink(e)
                    }}></span>
                    <input type="text" name="" id="" value={link} onInput={(e) => {
                        setNewLink({
                            link: e.target.value
                        })
                    }} />
                </div>
            </div>
            <div className="text-editor__interface">

                <div className="text-editor__font">
                    <p className="text-editor__title">Шрифт</p>
                    <div className="wrapper-dropdown" id="dropdown">
                        <span className="selected-display" id="destination">Выберите стиль шрифта</span>
                        <svg id="drp-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow transition-all ml-auto rotate-180">
                            <path d="M7 14.5l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <ul className="dropdown">
                            {fontFamilies ? setFontOptions(fontFamilies, 'font') : null}
                        </ul>
                    </div>
                </div>
                <div className="text-editor__style">
                    <p className="text-editor__title">Стиль</p>
                    <div className="wrapper-dropdown" id="dropdown">
                        <span className="selected-display" id="destination">Выберите толщину шрифта</span>
                        <svg id="drp-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow transition-all ml-auto rotate-180">
                            <path d="M7 14.5l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <ul className="dropdown">
                            {fontWeight ? setFontOptions(fontWeight, 'weight') : null}
                        </ul>
                    </div>
                </div>
                <div className="text-editor__size">
                    <p className="text-editor__title">Размер</p>
                    <div className="input-number">
                        <input className="input-number__input" type="text" pattern="^[0-9]+$" onChange={(e) => {}} value={defaultTextSize} id="size" />
                        <div className="input-number__top" onClick={(e) => {
                            setFontStyle(temporaryFontStyle => ({
                                ...temporaryFontStyle,
                                size: ++temporaryFontStyle.size
                            }))
                        }}></div>
                        <div className="input-number__bottom" onClick={(e) => {
                            setFontStyle(temporaryFontStyle => ({
                                ...temporaryFontStyle,
                                size: --temporaryFontStyle.size
                            }))
                        }}></div>
                    </div>
                </div>

            </div>
        </>
    )

}