const apikey="KhvcyMadedMDwFVItWxKfJ78aKwF7TbNtOTL5obYaeOILn53xmK8YrTB";
const imageWrapper=document.querySelector(".images")
const loadMore= document.querySelector(".load-more")
const searchInput =document.querySelector(".search-box input")
const lightbox= document.querySelector(".lightbox")
const Closebutton= document.querySelector(".uil-times");
const downloadbtn= document.querySelector(".uil-import");

const perPage=15;
let currentPage =1;
let serachItem =null;

// fetch image url change response to blob then crete a tag a.href=
// will be createObjectURL (file) a.click();
const downloading=(imgURL)=>{
  console.log(imgURL);
  fetch(imgURL).then(res =>res.blob()).then(file =>{
    const a= document.createElement("a");
    a.href=URL.createObjectURL(file);
    a.download=new Date().getTime();
    a.click();
  }).catch(()=>alert("Failed to download image"));
}

const showlightbox =(name, image)=>{
    lightbox.querySelector("img").src=image;
    lightbox.querySelector("span").innerText=name;
    downloadbtn.setAttribute("data-img", image);
    lightbox.classList.add("show");
    document.body.style.overflow="hidden";
}


const hidelightBox = ()=>{
    lightbox.classList.remove("show");
    document.body.style.overflow="auto";
}

const generateHTML = (images)=>{
   imageWrapper.innerHTML+= images.map(img =>
        `  <li class="card" onclick="showlightbox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
                <button onclick="downloading('${img.src.large2x}')">
                <i class="uil uil-import"></i></button>
        </div>
    </li> `
        
        ).join("");
}
const getImages=(apiURL)=>{
   loadMore.innerHTML="Loading...";
   loadMore.classList.add("disabled");
   fetch(apiURL, {
    headers:{Authorization:apikey}
   }).then(res=>res.json()).then(data=>{
    generateHTML(data.photos);
    loadMore.innerHTML="Load More";
    loadMore.classList.remove("disabled");
   }).catch(()=>{
    loadMore.innerHTML="Load More";
    loadMore.classList.remove("disabled");
    return (alert("Failed to load images"))})
}
const loadMoreimages=()=>{
    currentPage++;
    let apiURL=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL=serachItem? `https://api.pexels.com/v1/search?query=${serachItem}&page=${currentPage}&per_page=${perPage}`:apiURL
    getImages(apiURL);
}
const loadSearchImages = (e) =>{
    if(e.key == "Enter"){
        serachItem=e.target.value;
        imageWrapper.innerHTML="";
       
        getImages(`https://api.pexels.com/v1/search?query=${serachItem}&page=${currentPage}&per_page=${perPage}`)
    }
}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMore.addEventListener("click",loadMoreimages);
searchInput.addEventListener("keyup", loadSearchImages);
Closebutton.addEventListener("click", hidelightBox);
downloadbtn.addEventListener("click", (e)=>downloading(e.target.dataset.img))

