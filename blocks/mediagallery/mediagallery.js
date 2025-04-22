import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

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

export default function decorate(block) {
    const galleryLinks =block.querySelectorAll('a')
    galleryLinks.forEach(link => {
        const imageUrl = link.href;

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = link.title || 'Gallery Image';
        img.style.width = imagesHeight.desktop.width
        img.style.height=imagesHeight.desktop.height
        img.style.display = "block"
        img.style.cursor="pointer"
        img.classList.add('media-gallery-images')
        const mediagallerySection = link.parentElement.parentElement.parentElement;
        mediagallerySection.innerHTML=""
        mediagallerySection.append(img)
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
            <p class="media-gallery-modal-title">A scenic aerial view of Resorts World Sentosa</p>
            <p class="media-gallery-modal-description">3 Feb 2025</p>
        </div>
        <a href="#" class="media-gallery-modal-btn"></a>
    </div>
    `
    const downloadIcon = stringToHTML(SvgIcon({ name: 'downloadarrow', size: '16px' }));
    bodySubSection.querySelector('.media-gallery-modal-btn').append(downloadIcon)

    const closeIcon = stringToHTML(SvgIcon({ name: 'close', color: "#B29152", size: '16px' }));
    
    const closeBtn=document.createElement('button')
    closeBtn.classList.add("media-gallery-modal--close-btn")
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

    document.querySelector('.media-gallery-modal--close-btn').addEventListener('click',()=>{
        const modal = document.querySelector('.media-gallery-modal')
        modal.style.visibility = 'hidden'
        document.body.style.overflowY = 'scroll'
    })
}