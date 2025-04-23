import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';
import ImageComponent from "../../shared-components/ImageComponent.js";

const imagesHeight={
    lg:{
        desktop: { height: "451px", width:"100%"},
        tablet: { height: "301px", width:"100%"},
    },
    mobile:{
        width:"100%",
        height:"206px"
    },
    tablet:{
        width:"100%",
        height:"136px"
    },
    desktop:{
        width:"100%",
        height:"206px"
    }
}

function updateImagesProperty(block){
    if (window.innerWidth < 767) {
        const images = block.querySelectorAll('img')
        images.forEach(img => {
            img.style.width = imagesHeight.mobile.width
            img.style.height = imagesHeight.mobile.height
        })
    } else if(window.innerWidth < 993){
        const mediaGallery = block.querySelectorAll('img')
        mediaGallery.forEach(img=>{
            img.style.width = imagesHeight.tablet.width
            img.style.height = imagesHeight.tablet.height
        })
        const largeImg=block.querySelectorAll(".right-img img")
        largeImg.forEach(img=>{
            img.style.height=imagesHeight.lg.tablet.height
            img.style.width = imagesHeight.lg.tablet.width
        })
    }
}

function handleLayoutOnResize(block){
    updateImagesProperty(block)
    window.addEventListener("resize", () => {
        updateImagesProperty(block)
     });

}

function handleDownload() {
    const downloadBtn = document.querySelector('.media-gallery-modal-btn')
    if (!downloadBtn.hasAttribute('data-listener-added')) {
        downloadBtn.addEventListener('click', async () => {
            const imgLink = downloadBtn.getAttribute('data-listener-link')
            try {
                const response = await fetch(imgLink);
                const blob = await response.blob();
                const mimeType = blob.type;

                const extension = mimeType.split('/')[1] || 'jpg'; // fallback to jpg
                const fileName = `downloaded-image.${extension}`;

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Image download failed:', error);
            }
        })
    }
    downloadBtn.setAttribute('data-listener-added', 'true');
}

export default function decorate(block) {
    const galleryLinks =block.querySelectorAll('a')
    galleryLinks.forEach(link => {
        const imageUrl = link.href;

        const imageDetails = link.parentElement.parentElement.parentElement.querySelectorAll('div')

        const mediagallerySection = link.parentElement.parentElement.parentElement;

        const picture = ImageComponent({
            src: imageUrl,
            alt: link.title || 'Gallery Image',
            className: 'media-gallery-images',
            breakpoints: {
                mobile: {
                    src: `${imageUrl}`,
                    height:imagesHeight.mobile.height
                },
                tablet: {
                    src: `${imageUrl}`,
                    height: imagesHeight.tablet.height
                },
                desktop: {
                    src: `${imageUrl}`,
                    height: imagesHeight.desktop.height
                },
            },
            lazy: true,
        });

        mediagallerySection.innerHTML=""
        const parsedImg = stringToHTML(picture)
        const img = parsedImg.querySelector('img')
        img.setAttribute('data-listener-title', imageDetails[1].innerText)
        img.setAttribute('data-listener-date', imageDetails[2].innerText)
        mediagallerySection.append(parsedImg)
    }); 

    const checkElementExist= Array.from(block.classList)
    
    const firstRows=checkElementExist.includes('mg-two-one-row')
    const secRows=checkElementExist.includes('mg-one-two-row')
    const lastRows=checkElementExist.includes('mg-one-one-one-row')

    if(lastRows){
        block.classList.add('last-row')
    }

    if(firstRows){
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('wrapped-container');
        Array.from(block.children).forEach((element, index) => {
            if (index < 2) {
                wrapperDiv.appendChild(element.cloneNode(true));
                element.remove()
            }
            else {
                element.classList.add("right-img")
                element.classList.add("ml")
                const img = element.querySelector('img')
                img.style.height = imagesHeight.lg.desktop.height
                img.style.width = imagesHeight.lg.desktop.width
            }

        })
        block.prepend(wrapperDiv)
    }

    if(secRows){
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('wrapped-container');
    
        Array.from(block.children).forEach((element, index) => {
            if (index > 0) {
                wrapperDiv.appendChild(element.cloneNode(true));
                element.remove()
            }else{
                const img = element.querySelector('img')
                img.style.height = imagesHeight.lg.desktop.height
                img.style.width = imagesHeight.lg.desktop.width
                element.classList.add("mr")
                element.classList.add("right-img")
    
            }
        })
    
        block.append(wrapperDiv)
    }
    handleLayoutOnResize(block)
    const modal = document.createElement('div')
    modal.classList.add("media-gallery-modal")

    const modalBody=document.createElement('div')
    modalBody.classList.add("media-gallery-modal-body")
    
    const modalImage=document.createElement('img')
    modalImage.classList.add('media-gallery-body-img')

    modalBody.append(modalImage)
    const bodySubSection = document.createElement('div')
    bodySubSection.innerHTML = `
    <div class="media-gallery-modal-bottom-section">
        <div>
            <p class="media-gallery-modal-title"></p>
            <p class="media-gallery-modal-description">3 Feb 2025</p>
        </div>
        <button class="media-gallery-modal-btn"></button>
    </div>
    `
    const downloadIcon = stringToHTML(SvgIcon({ name: 'downloadarrow', size: '16px' }));
    bodySubSection.querySelector('.media-gallery-modal-btn').append(downloadIcon)

    const closeIcon = stringToHTML(SvgIcon({ name: 'close', color: "#B29152", size: '16px' }));
    
    const closeBtn=document.createElement('button')
    closeBtn.classList.add("media-gallery-modal-close-btn")
    closeBtn.append(closeIcon)
    modalBody.appendChild(closeBtn)

    modalBody.append(bodySubSection)
    modal.append(modalBody)

    if (!document.querySelector('.media-gallery-modal'))
        document.body.appendChild(modal)

    document.querySelectorAll('.media-gallery-images').forEach((img)=>{

        if (!img.hasAttribute('data-listener-added')) {
            img.addEventListener('click', () => {
                const modalElement = document.querySelector('.media-gallery-modal')
                modalElement.style.visibility = 'visible'
                document.body.style.position='relative'
                const modalBodyElement = document.querySelector('.media-gallery-modal-body')
                const rect = modalBodyElement.getBoundingClientRect();
                const scrollTop =  document.documentElement.scrollTop;
                const scrollLeft = document.documentElement.scrollLeft;
                document.querySelector('.media-gallery-body-img').src=img.src
                document.querySelector('.media-gallery-modal-btn').setAttribute('data-listener-link', img.src)

                document.querySelector('.media-gallery-modal-title').innerHTML = img.getAttribute("data-listener-title")
                document.querySelector('.media-gallery-modal-description').innerHTML = img.getAttribute("data-listener-date")
                const top = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);
                const left = rect.left + scrollLeft - (window.innerWidth / 2) + (rect.width / 2);
                
                window.scrollTo({
                    top: top,
                    left: left,
                    behavior: 'smooth'
                });
                document.body.style.overflowY='hidden'
            })
        }
        // Mark that the listener has been added
        img.setAttribute('data-listener-added', 'true');
    })

    document.querySelector('.media-gallery-modal-close-btn').addEventListener('click',()=>{
        const modalElement = document.querySelector('.media-gallery-modal')
        modalElement.style.visibility = 'hidden'
        document.body.style.overflowY = 'scroll'
    })

    handleDownload()
}