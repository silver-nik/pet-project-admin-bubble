import showNotifications from "../../../helpers/notifications";
import { createRoot } from 'react-dom/client';
import Services from "../../../services/services";

export default class EditorImages {
    constructor(element, virtualElement, ...[isLoading, isLoaded, setImage, resetData]) {

        this.path = '';

        this.element = element;
        this.virtualElement = virtualElement;
        this.resetData = resetData;

            this.element.addEventListener('click', (e) => {

                this.resetData();

                this.setImage({
                    imageName: e.target.src,
                    imageElement: this.element,
                    imageId: this.element.getAttribute('editableimgid')
                })

            });

        this.imgUploader = document.querySelector('#img-upload');

        this.isLoading = isLoading;
        this.isLoaded = isLoaded;
        this.setImage = setImage;

        this.services = new Services();
        
    }

    setCurrentImg = (e) => {
        this.path = e.target.src;

        this.virtualElement.src = this.element.src = this.path;
    }

    postImage = () => {

        
        if(this.imgUploader.files && this.imgUploader.files[0]) {
            let formData = new FormData();

            formData.append('image', this.imgUploader.files[0]);

            this.isLoading();

            this.services.postImage(formData)
                .then((res) => {
                    this.virtualElement.src = this.element.src = `./img/Downloads/${res.data.src}`;
                })
                .catch(() => showNotifications('Ошибка сохранения', 'danger'))
                .finally(() => {
                    this.imgUploader.removeEventListener('change', this.postImage);
                    this.imgUploader.value = '';
                    this.isLoaded();
                    const domNode = document.createElement('div');
                    domNode.classList.add('root-modal');
                    const root = createRoot(domNode);

                    if(document.querySelector("#media-modal")) {

                        document.querySelector(".root-modal").remove();
                        document.querySelector("#media-modal").remove();

                        root.unmount();
                    }
                })
        }       

    }

    addNewImg = () => {
        this.imgUploader.click();
        this.imgUploader.addEventListener('change', this.postImage);
    }

}