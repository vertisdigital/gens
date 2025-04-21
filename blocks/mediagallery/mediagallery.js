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
        img.style.display="block"
        const mediagallerySection = link.parentElement.parentElement.parentElement;
        mediagallerySection.innerHTML=""
        mediagallerySection.append(img)
    }); 

    let firstRows, secRows, lastRows = null;
    const checkElementExist= Array.from(block.classList)
    
    firstRows=checkElementExist.includes('mg-two-one-row')
    secRows=checkElementExist.includes('mg-one-two-row')
    lastRows=checkElementExist.includes('mg-one-one-one-row')

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
    
}