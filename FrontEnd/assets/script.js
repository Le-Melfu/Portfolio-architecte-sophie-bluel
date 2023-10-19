//Récupération des données de l'API GET=>W

fetch("http://localhost:5678/api/works")
.then(response => {
    return response.json()
})
//Génération du contenu de la page
.then(result => {
    
    const gallery = document.querySelector(".gallery");
    const allWorksList = result;
    console.log(allWorksList);
    function OnClickfilterAll(){
        gallery.innerHTML = " ";
        for(let i = 0; i < allWorksList.length; i++){
            let fig = document.createElement("figure");
            let figImg = document.createElement("img");
            figImg.src = allWorksList[i].imageUrl;
            figImg.alt = allWorksList[i].title;
            let figCaption = document.createElement("figcaption");
            figCaption.innerHTML = allWorksList[i].title;
            fig.append(figImg, figCaption);
            gallery.appendChild(fig);
        };
        console.log("click");
    }
    //Création du filtres "Tous"
    let filterBar = document.querySelector(".filters");
    let filterBtnAll = document.createElement("button");
    filterBtnAll.innerText = "Tous";
    filterBtnAll.classList.add("filter-btn", "filter-btn-active");
    filterBtnAll.addEventListener("click", () =>{
        OnClickfilterAll()
    });
    filterBar.appendChild(filterBtnAll);
    OnClickfilterAll();
    return allWorksList;
})
//Génération des boutons de filtres
.then((allWorksList) => {
    //Récupération des Catégories
    const categoriesList = allWorksList.map(allWorksList => allWorksList.category.name);
    let filteredCategoriesList = new Set(categoriesList);
    console.log(filteredCategoriesList);
    
    //Création des boutons de filtres
    

    function OnClickfilter(categorie){
        const gallery = document.querySelector(".gallery");
        if(categorie === "all"){
            // afficher Tout
            OnClickfilterAll();
        }else{
            gallery.innerHTML = "";
            const filteredWorks = allWorksList.filter(function (allWorksList){
                return allWorksList.category.name === categorie
            });
            for(let i = 0; i < filteredWorks.length; i++){
                let fig = document.createElement("figure");
                let figImg = document.createElement("img");
                figImg.src = filteredWorks[i].imageUrl;
                figImg.alt = filteredWorks[i].title;
                let figCaption = document.createElement("figcaption");
                figCaption.innerHTML = filteredWorks[i].title;
                fig.append(figImg, figCaption);
                gallery.appendChild(fig);
            };
        }
    }

    let filterBar = document.querySelector(".filters");
    filteredCategoriesList.forEach((categorie) => {
        let filterBtn = document.createElement("button");
        filterBtn.classList.add("filter-btn");
        filterBtn.innerText = categorie;
        filterBtn.addEventListener("click", () => {
            OnClickfilter(categorie);
        });
        filterBar.appendChild(filterBtn)
    })
    

})



//Créer un event listener sur chaque bouton qui actualise la page au clic
// => il enlève le contenu de la gallery au clic 
// et re-génère uniquement les éléments disposant de la bonne catégorie

// filterBtn.addEventListener("click", =>{
    // gallery.innerHTML = "";
    // array.filter(function (allWorksList){
    //     return allWorksList.categoryId === categoriesList.id
    // });


