import axios from "axios";
import showNotifications from "../../../helpers/notifications";

export default class EdiotrLinks {
    constructor(element, virtualElement, ...[isLoading, isLoaded, setLink]) {
        this.element = element;
        this.virtualElement = virtualElement;

        this.element.addEventListener('contextmenu', (e) => {
            this.setLinkEditor(e);

            this.setLink(this.element.href, this.element, this.element.getAttribute('editablelinksid'))

        });

        this.element.addEventListener('click', (e) => {
            e.preventDefault();
        });

        this.isLoading = isLoading;
        this.isLoaded = isLoaded;
        this.setLink = setLink;

        this.newPath = '';
    }

    setLinkEditor = (e) => {
        e.preventDefault();

        // this.element.style.position = 'relative';

        // if(!this.element.querySelector('.editor-link__wrapper')) {
        //     let edtorLinks = document.createElement('div');

        //     edtorLinks.classList.add('editor-link__wrapper');

        //     edtorLinks.style.cssText = `
        //         background-color: #fefefe;
        //         margin: 5% auto;
        //         padding: 20px;
        //         border: 1px solid #888;
        //         width: 30vw;
        //         position: absolute;
        //         top: 0;
        //         z-index: 10;
        //         color: black;
        //     `;

        //     edtorLinks.innerHTML = `
        //         <p>
        //             Текущий адресс
        //             <span>${e.target.parentNode.href}</span>
        //         </p>
        //         <p>
        //             <input type="text" value="" placeholder="Введите новый адресс" class="link-editor"/>
        //         </p>
        //         <button class="link-editor-btn">Save new path</button>
        //     `;

        //     this.element.append(edtorLinks);

        //     this.element.querySelector('.link-editor-btn').addEventListener('click', (e) => this.changeLinkPath2(e, this.newPath));
        //     this.element.querySelector('.link-editor').addEventListener('input', (e) => this.newPath = e.target.value);


        // } else {
        //     this.element.querySelector('.editor-link__wrapper').remove();
        // } 

    }
}