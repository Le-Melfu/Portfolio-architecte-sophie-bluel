
const gallery = document.querySelector(".gallery");
let filterBar = document.querySelector(".filters");

//Récupération des données de l'API
fetch("http://localhost:5678/api/works")

//Conversion de la réponse de l'API en JSON
.then(response => {
    if(!response.ok){
        throw new Error
    }
    return response.json()
})

//Stockage de la réponse dans la variable allWorksList
.then(result => {
    const allWorksList = result;
    return allWorksList
})

//Génération des boutons de filtres
.then((allWorksList) => {
    // Fonction de génération de contenu
    
    function generateGalleryContent(content){
        gallery.innerHTML = " ";
        for(let i = 0; i < content.length; i++){
            let fig = document.createElement("figure");
            let figImg = document.createElement("img");
            figImg.src = content[i].imageUrl;
            figImg.alt = content[i].title;
            let figCaption = document.createElement("figcaption");
            figCaption.innerHTML = content[i].title;
            fig.append(figImg, figCaption);
            gallery.appendChild(fig)
        };
    };
    generateGalleryContent(allWorksList);

    //Récupération des Catégories
    let setCategoriesList = new Set(allWorksList.map(allWorksList => allWorksList.category.name));

    // Si le token existe
    if(window.localStorage.getItem("token") != undefined){
        // Modification du bouton Login en Logout
        const logInBtn = document.querySelector(".login-link");
        logInBtn.innerText = "logout";
        logInBtn.href = "#";
        logInBtn.addEventListener("click", () => {
            window.localStorage.removeItem("token");
            window.location.href = "./index.html"
        });
    
        // Bouton de modification
        const modifyWorksBtn = document.createElement("p");
        modifyWorksBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
        const portfolioHeader = document.querySelector(".portfolio__header");
        portfolioHeader.appendChild(modifyWorksBtn)
    }else{
        //Création du bouton filtre "Tous"
        let filterBtnAll = document.createElement("button");
        filterBtnAll.innerText = "Tous";
        filterBtnAll.classList.add("filter-btn", "filter-btn-active");
        filterBtnAll.addEventListener("click", () =>{
            OnClickfilter("Tous");
            filterBtnAll.classList.add("filter-btn-active")
        });
        filterBar.appendChild(filterBtnAll);

        //Création des boutons par Catégories
        setCategoriesList.forEach((categorie) => {
            let filterBtn = document.createElement("button");
            filterBtn.classList.add("filter-btn");
            filterBtn.innerText = categorie;
            filterBtn.addEventListener("click", () => {
                OnClickfilter(categorie);
                filterBtn.classList.add("filter-btn-active")
            });
            filterBar.appendChild(filterBtn)
        });

        //Fonction du click des boutons de filtre
        function OnClickfilter(categorie){
            const allFiltersBtn = document.querySelectorAll(".filter-btn");
            allFiltersBtn.forEach((filter) => {
                filter.classList.remove("filter-btn-active")
            });
            if(categorie === "Tous"){
                generateGalleryContent(allWorksList);
            }else{
                const filteredWorks = allWorksList.filter(function (allWorksList){
                    return allWorksList.category.name === categorie
                });
                generateGalleryContent(filteredWorks)
            }
        }        
    }
})
.catch((error) => {
    const galleryError = document.createElement("p");
    galleryError.innerText = "Une erreur est survenue";
    gallery.appendChild(galleryError)
});



