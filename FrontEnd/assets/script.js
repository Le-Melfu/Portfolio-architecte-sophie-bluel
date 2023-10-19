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
    }
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
    const filterBar = document.querySelector(".filters");
    let filterBtnAll = document.createElement("button");
    filterBtnAll.innerHTML = "Tous";
    filterBtnAll.classList.add("filter-btn", "filter-btn-active");
    filterBar.appendChild(filterBtnAll);

    filteredCategoriesList.forEach((categorie) => {
        let filterBtn = document.createElement("button");
        filterBtn.classList.add("filter-btn");
        filterBtn.innerText = categorie;
        filterBtn.data;
        filterBar.appendChild(filterBtn)
    })
    // function OnClickfilter(categorie){
    //     gallery.innerHTML = "";
    //     if(categorie === undefined){
    //         // afficher Tout
    //         OnClickfilterAll();
    //     }
    // }

})



//Créer un event listener sur chaque bouton qui actualise la page au clic
// => il enlève le contenu de la gallery au clic 
// et re-génère uniquement les éléments disposant de la bonne catégorie

// filterBtn.addEventListener("click", =>{
    // gallery.innerHTML = "";
    // array.filter(function (allWorksList){
    //     return allWorksList.categoryId === categoriesList.id
    // });


