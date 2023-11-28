export default class EditorText {
    constructor(element, virtualElement, setText, setLink, setFontStyles, resetData) {
        this.element = element;
        this.virtualElement = virtualElement;

        this.setText = setText;
        this.setLink = setLink;
        this.setFontStyles = setFontStyles;
        this.resetData = resetData;
        
        this.element.addEventListener('click', (e) => {
            this.onClick(e);
        })

        this.element.addEventListener('input', () => {
            this.onTextEdit();
        })  

        if(this.element.parentNode.nodeName === 'A') {
            this.element.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.onLinkEdit(e);
            })
        }

    }

    onClick(e) {
        e.preventDefault();

        document.querySelector('.iframe-menu__editor').classList.add('open');

        this.element.focus(); 

        this.resetData();

        this.setFontStyles(fontStyles => ({
            ...fontStyles,
            size: getComputedStyle(this.element).fontSize.replace(/[^0-9]/g, "")
        }))

        if(this.element.parentNode.nodeName === 'SPAN') {
            if(this.element.parentNode.parentNode.nodeName === 'A') {
                this.setText({
                    textContent: this.element.innerText.replace(/<br\s*\/?>/mg, "\n"),
                    elementText: this.element,
                    idText: this.element.getAttribute('nodeid'),
                    isLink: true
                })
                this.setLink({
                    link: this.element.closest('a').href
                })
            } else {
                this.setText({
                    textContent: this.element.innerText.replace(/<br\s*\/?>/mg, "\n"),
                    elementText: this.element,
                    idText: this.element.getAttribute('nodeid'),
                    isLink: false
                })
            }
            
        } else if(this.element.parentNode.nodeName === 'A') {
            this.setText({
                textContent: this.element.innerText.replace(/<br\s*\/?>/mg, "\n"),
                elementText: this.element,
                idText: this.element.getAttribute('nodeid'),
                isLink: true
            })
            this.setLink({
                link: this.element.closest('a').href
            })
        } else {
            this.setText({
                textContent: this.element.innerText.replace(/<br\s*\/?>/mg, "\n"),
                elementText: this.element,
                idText: this.element.getAttribute('nodeid'),
                isLink: false
            })
        }

    }

    onTextEdit() {
        this.virtualElement.innerHTML = this.element.innerHTML;
    }

    onCtxMenu(e) {
        e.preventDefault();

        this.onClick();
    }

    onLinkEdit(e) {
        e.preventDefault();

        this.virtualElement.innerHTML = this.element.innerHTML;
    }
}