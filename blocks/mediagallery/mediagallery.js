const imagesHeight={
    lg:{
        desktop: { height: "451px", width:"735px"},
        tablet: { height: "301px", width:"490px"},
    },
    mobile:{
        width:"342px",
        height:"206px"
    },
    tablet:{
        width:"233px",
        height:"136px"
    }
}

function updateImagesProperty(block){
    if (window.innerWidth < 767) {
        const images = block.querySelectorAll('img')
        images.forEach(img => {
            img.style.width = imagesHeight.mobile.width
            img.style.height = imagesHeight.mobile.height
        })
    } else {
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
        img.style.width="100%"
        img.style.display="block"
        const mediagallerySection = link.parentElement.parentElement.parentElement;
        mediagallerySection.innerHTML=""
        mediagallerySection.append(img)
    }); 

    const mediaGallery = block.querySelectorAll('[data-block-name="mediagallery"]')
    const firstRow = mediaGallery[0]
    firstRow.classList.add('one-two-row')
    const secRow = mediaGallery[1]
    secRow.classList.add('one-two-row')
    const lastRow=mediaGallery[mediaGallery.length - 1]
    lastRow.classList.add('last-row')

    

    const wrapperDiv1 = document.createElement('div');
    wrapperDiv1.classList.add('wrapped-container');

    Array.from(firstRow.children).forEach((element, index) => {
        if (index < 2){
            const img=element.querySelector('img')
            img.style.width = "349px"
            img.style.height = "206px"
            wrapperDiv1.appendChild(element.cloneNode(true));
            element.remove()
        }
        else{
            element.classList.add("right-img")
            element.classList.add("ml")
            const img = element.querySelector('img')
            img.style.height = imagesHeight.lg.desktop.height
            img.style.width = imagesHeight.lg.desktop.width
        }

    })
    firstRow.prepend(wrapperDiv1)
    const wrapperDiv2 = document.createElement('div');
    wrapperDiv2.classList.add('wrapped-container');

    Array.from(secRow.children).forEach((element, index) => {
        if (index > 0) {
            const img = element.querySelector('img')
            img.style.width = "349px"
            img.style.height = "206px"
            wrapperDiv2.appendChild(element.cloneNode(true));
            element.remove()
        }else{
            const img = element.querySelector('img')
            img.style.height = imagesHeight.lg.desktop.height
            img.style.width = imagesHeight.lg.desktop.width
            element.classList.add("mr")
            element.classList.add("right-img")

        }
    })

    secRow.append(wrapperDiv2)

    handleLayoutOnResize(block)
    
}