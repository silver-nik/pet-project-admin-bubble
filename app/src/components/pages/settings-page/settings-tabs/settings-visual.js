import React, { useEffect, useState } from "react";
import Services from "../../../../services/services";

export default function SettingsAppearance({id, color, theme, updateThemeStyles}) {

    const [colours, setColours] = useState('');
    const [themes, setThemes] = useState('');
    const [currentColour, setCurrentColour] = useState('');
    const [currentTheme, setCurrentTheme] = useState('');

    const services = new Services();
    
    const renderAccentColors = (data) => {
        
        return data.map((colour, key) => {
            return (
                <li className="rounded-colour" 
                    key={key} 
                    data-color={colour.color} 
                    data-name={colour.nameColor} 
                    style={{background: colour.color}} 
                    onClick={(e) => setActiveColor(e, '.rounded-colour')}
                ></li>
            )
        })
    
    }

    const renderThemes = (data) => {
        
        return data.map((theme, key) => {
            return (
                <li className="theme-item" key={key} data-id={theme.id} onClick={(e) => setActiveTheme(e, 'theme-item')}>
                    <img src={`http://react-admin/img/${theme.name}.png`} alt="" />
                    <p>{theme.name}</p>
                    <div className="rounded-colour"></div>
                </li>
            )
        })
    
    }

    const setActiveColor = (e, className) => {

        document.querySelectorAll(className).forEach(el => el.classList.remove('active-color'));

        e.target.classList.add('active-color');

        let dataCurrentColour = e.target.getAttribute('data-color');
        
        setCurrentColour(dataCurrentColour);

        let css = `::selection { background-color: ${dataCurrentColour} }`;
        let style = document.querySelector('style');

        if (style) {
            style.innerHTML = css;
        } else {
            let head = document.head || document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            style.innerHTML = css;
            head.appendChild(style);
        }

        document.querySelectorAll(`.theme-item`).forEach(el => {
            if(el.classList.contains('active-theme')) {
                el.style.border = `3px solid ${dataCurrentColour}`;

                el.querySelector('.rounded-colour').style.cssText = `
                    background: ${dataCurrentColour};
                    display: block;
                `;

            } else {
                el.style.border = '';
                el.querySelector('.rounded-colour').style.display = 'none';
            }
        });
    }

    const setActiveTheme = (e, className) => {
        document.querySelectorAll(`.${className}`).forEach(el => {
            el.style.border = '';
            el.querySelector('.rounded-colour').style.display = 'none';
            el.classList.remove("active-theme");
        });

        if(e.target.classList.contains(className) && currentColour) {

            const id = e.target.getAttribute('data-id');

            e.target.style.border = `3px solid ${currentColour}`;

            e.target.classList.add("active-theme");

            e.target.querySelector('.rounded-colour').style.cssText = `
                background: ${currentColour};
                display: block;
            `;

            setCurrentTheme(id);
        }
    }

    const setInitial = (color, idTheme) => {

        setCurrentColour(color);
        setCurrentTheme(idTheme);

        document.querySelectorAll('.rounded-colour').forEach((round) => {
            if(round.getAttribute('data-color') === color) {
                round.classList.add('active-color');
            }
        })
      
        document.querySelectorAll('.theme-item').forEach((theme) => {
            if(theme.getAttribute('data-id') == idTheme) {
                theme.classList.add('active-theme');
                theme.style.border = `3px solid ${color}`;

                theme.querySelector('.rounded-colour').style.cssText = `
                    background: ${color};
                    display: block;
                `;
            }
        })
      }

    const postAppearance = (id, color, theme) => {
        services.postAppearance(id, color, theme)
            .then((res) => {
                updateDataInstallation();
            })

    }

    const updateDataInstallation = () => {
        let currentColorObj;
        let currentThemeObj;

        if(colours) {
            colours.forEach(el => {
                if(el.color == currentColour) {
                    currentColorObj = el;
                }
            })
        }

        if(themes) {
            themes.forEach(theme => {
                if(theme.id == currentTheme) {
                    currentThemeObj = theme;
                }
            })
        }

        updateThemeStyles(currentThemeObj, currentColorObj);

    }

    useEffect(() => {

        // axios
        //     .get('http://localhost:3000/accentColors')
        services.getVisualOptions('http://localhost:3000/accentColors')
            .then((res) => {
                setColours(res);
            })

        // axios
        //     .get('http://localhost:3000/themes')
        services.getVisualOptions('http://localhost:3000/themes')
            .then((res) => {
                setThemes(res);
            })
            
    }, []);

    useEffect(() => {

        setInitial(color.color, theme.id);

    }, [colours, themes]);


    return (

        <div className="user-appearance">

            <div className="user-data__body d-flex">

                <div className="mount">

                    <div className="user-data__main-info">
                        <div className="personal__wrapper">
                            <h6>Внешний вид</h6>
                        </div>
                        <ul className="accent-colour">
                            {
                               colours ? renderAccentColors(colours) : null
                            }
                        </ul>
                        <div className="example-appearance d-flex">
                            <div>
                                <span className="text-muted">Меню</span>
                                <span className="example__menu-item" style={{background: currentColour}}>
                                    <span uk-icon="home" uk-tooltip="Главная" className="icon"></span>
                                    Пункт меню
                                </span>
                            </div>
                            <div className="emphasis">
                                <span className="text-muted">Выделение текста</span>
                                <p>
                                    <span className="example__emphasis" style={{background: currentColour}}>Пример </span>выделенного текста
                                </p>
                            </div>
                        </div>
                        <div className="example-theme">
                            <div className="personal__wrapper">
                                <h6>Выберите тему</h6>
                            </div>
                            <ul className="theme-list d-flex">
                                {themes ? renderThemes(themes) : null}
                            </ul>
                        </div>
                    </div>

                    <div className="btn-collection d-flex">

                        <button className="uk-button" onClick={(e) => {
                            postAppearance(id, currentColour, currentTheme);
                        }}>Сохранить изменения</button>

                    </div>

                </div>

            </div>

        </div>
        
    );

}