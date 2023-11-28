export default class DOMHelper {
    static parseStringToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    static wrapTextNodes(dom) {
        const body = dom.body;
        let textNodes = [];

        function recursy(element) {
            element.childNodes.forEach(node => {
                
                // if(node.nodeName === 'SPAN' && node.className === 'wrapped-container') {
                //     textNodes.push(node);
                // }
                if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0) {
                    textNodes.push(node);
                } 
                else {
                    recursy(node);
                }
            })
        };

        recursy(body);

        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute('nodeid', i);
        });

        return dom;
    }

    static unwrapTextNodes(dom) {

        dom.body.querySelectorAll('text-editor').forEach(el => {

            let newStyle = '';

            if(el.getAttribute('style')) {
                newStyle = el.getAttribute('style');
            }

            if(el.childNodes.length > 1) {

                let newNodes = [...el.childNodes];

                el.innerHTML = '';

                let newNodeElement = document.createElement('span');

                newNodeElement.classList.add('wrapped-container');

                newNodes.forEach(child => {
                    // if(el.getAttribute('style')) {
                    //     newStyle = el.getAttribute('style');
                    // }

                    // let childWithStyle = child.style.cssText = newStyle;
                    console.log(child);

                    newNodeElement.appendChild(child);
                })

                el.parentNode.replaceChild(newNodeElement, el);
            } else {
                
                if(el.getAttribute('style')) {
                    newStyle = el.getAttribute('style');

                    if(el.parentNode.classList.contains('styled')) {
                        el.parentNode.style.cssText = newStyle;
                        el.parentNode.replaceChild(el.firstChild, el);
                    } else {
                        let newNodeElement = document.createElement('span');
                        newNodeElement.classList.add('styled');

                        newNodeElement.style.cssText = newStyle;

                        newNodeElement.append(el.firstChild);

                        el.parentNode.replaceChild(newNodeElement, el);
                    }
                } else {
                    el.parentNode.replaceChild(el.firstChild, el);
                }

            }

        })
    }

    static serializeDOMToString(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    static wrapImages(dom) {
        dom.body.querySelectorAll('img').forEach((img, i) => {
            img.setAttribute('editableImgId', i);
        });

        return dom;
    }

    static unwrapImages(dom) {
        dom.body.querySelectorAll('[editableImgId]').forEach(img => {
            img.removeAttribute('editableImgId');
        });
    }

    static wrapLinks(dom) {
        dom.body.querySelectorAll('a').forEach((img, i) => {
            img.setAttribute('editableLinksId', i);
            img.style.textDecoration = 'underline';
        });

        return dom;
    }

    static unwrapLinks(dom) {
        dom.body.querySelectorAll('[editableLinksId]').forEach(link => {
            link.removeAttribute('editableLinksId');
            link.style.textDecoration = 'none';
        });
    }
}