//Récupération des données de l'API
fetch("http://localhost:5678/api/works")

//Conversion de la réponse de l'API en JSON
.then(response => {
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
    const gallery = document.querySelector(".gallery");
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

    //Création du bouton filtre "Tous"
    let filterBar = document.querySelector(".filters"); 
    let filterBtnAll = document.createElement("button");
    filterBtnAll.innerText = "Tous";
    filterBtnAll.classList.add("filter-btn", "filter-btn-active");
    filterBtnAll.addEventListener("click", () =>{
        OnClickfilter("Tous");
        filterBtnAll.classList.add("filter-btn-active")
    });
    filterBar.appendChild(filterBtnAll);

    //Récupération des Catégories
    let setCategoriesList = new Set(allWorksList.map(allWorksList => allWorksList.category.name));

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
        allFiltersBtn = document.querySelectorAll(".filter-btn");
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
})
.catch((error) => {
    console.log("Une erreur est survenu")
});

