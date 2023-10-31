
const gallery = document.querySelector(".gallery");
let filterBar = document.querySelector(".filters");
let modal = document.querySelector(".modal");
let modalWrapperEdit = document.querySelector(".modal-wrapper-edit");
let modalWrapperForm = document.querySelector(".modal-wrapper-form");

function stopPropagation(e) {
    e.stopPropagation
};
function openModal(e) {
    modal.style.display = null;
    modalWrapperEdit.style.display = null;
};
function closeModal(e) {
    modal.style.display = "none";
    modalWrapperEdit.style.display = "none";
    modalWrapperForm.style.display = "none";

};

//Récupération des données de l'API
fetch("http://localhost:5678/api/works")

    //Conversion de la réponse de l'API en JSON
    .then(response => {
        if (!response.ok) {
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

        function generateGalleryContent(content, container) {
            gallery.innerHTML = " ";
            for (let i = 0; i < content.length; i++) {
                let fig = document.createElement("figure");
                let figImg = document.createElement("img");
                figImg.src = content[i].imageUrl;
                figImg.alt = content[i].title;
                let figCaption = document.createElement("figcaption");
                figCaption.innerHTML = content[i].title;
                fig.append(figImg, figCaption);
                container.appendChild(fig)
            };
        };
        generateGalleryContent(allWorksList, gallery);

        //Récupération des Catégories
        let setCategoriesList = new Set(allWorksList.map(allWorksList => allWorksList.category.name));
        console.log(setCategoriesList);
        // Vérification du token
        if (window.localStorage.getItem("token") != undefined) {
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

            //Ouverture  de la modale
            modifyWorksBtn.addEventListener("click", () => {
                openModal(modalWrapperEdit)
            });

            //Contenu de la modale
            let galleryContent = allWorksList.map(allWorksList => allWorksList.imageUrl);
            let galleryEdit = document.querySelector(".modal-wrapper-edit .edit-gallery");
            galleryContent.forEach((image) => {
                let editWork = document.createElement("div");
                editWork.classList.add("work-edit");
                let editImg = document.createElement("img");
                let deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-btn");
                deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>`;
                editImg.src = image;
                editWork.append(editImg, deleteBtn);
                galleryEdit.appendChild(editWork)
            });

            // Bouton d'envoi vers le formulaire d'ajout d'image
            let addWorkBtn = document.querySelector(".add-work-btn");
            addWorkBtn.addEventListener("click", () => {
                modalWrapperEdit.style.display = "none";
                modalWrapperForm.style.display = null;
            });

            // Flèche de retour à la gallerie d'édition
            let leftArrow = document.querySelector(".arrow-left");
            leftArrow.addEventListener("click", () => {
                modalWrapperForm.style.display = "none";
                modalWrapperEdit.style.display = null;
            });

            //Catégories du formulaire
            let categorySelection = document.querySelector("#form-category");
            setCategoriesList.forEach((categorie) => {
                let option = document.createElement("option");
                option.value = categorie;
                option.innerText = categorie;
                categorySelection.appendChild(option)
            });

            // Fermeture de la modale
            const exitCross = document.querySelector(".exit-cross");
            const exitModal = document.querySelector(".modal-bg");
            exitCross.addEventListener("click", () => {
                closeModal()
            });
            exitModal.addEventListener("click", () => {
                closeModal()
            });
            exitModal.addEventListener("click", stopPropagation);

        } else {
            //Création du bouton filtre "Tous"
            let filterBtnAll = document.createElement("button");
            filterBtnAll.innerText = "Tous";
            filterBtnAll.classList.add("filter-btn", "filter-btn-active");
            filterBtnAll.addEventListener("click", () => {
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
            function OnClickfilter(categorie) {
                const allFiltersBtn = document.querySelectorAll(".filter-btn");
                allFiltersBtn.forEach((filter) => {
                    filter.classList.remove("filter-btn-active")
                });
                if (categorie === "Tous") {
                    generateGalleryContent(allWorksList, gallery);
                } else {
                    const filteredWorks = allWorksList.filter(function (allWorksList) {
                        return allWorksList.category.name === categorie
                    });
                    generateGalleryContent(filteredWorks, gallery)
                }
            }
        }
    })
    .catch((error) => {
        const galleryError = document.createElement("p");
        galleryError.innerText = "Une erreur est survenue";
        gallery.appendChild(galleryError)
    });



// Preview de l'image Uploadée
const filePicture = document.getElementById("picture");
const filePreview = document.getElementById("preview");
const fileInput = document.querySelector(".file-input")
const submitBtn = document.querySelector(".modal-wrapper-form .modal-btn");
const filePictureReader = new FileReader();

filePicture.addEventListener("change", function () {
    if (filePicture.files && filePicture.files[0]) {
        filePictureReader.onload = function (e) {
            filePreview.src = e.target.result;
            filePreview.style.display = null;
        };
        fileInput.style.display = "none"
        submitBtn.classList.remove("disabled")
        filePictureReader.readAsDataURL(filePicture.files[0]);
        filePictureReader.onloadend = console.log(filePictureReader)
    };
});

// Récupération des données du formulaire
const filePictureTitle = document.getElementById("picture-title");
const fileCategory = document.getElementById("form-category");
const addWorkForm = document.getElementById("add-work-form");

addWorkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //Récupérer l'ID de catégorie
    //pour chaque valeur de setCategoriesList vérifier si elle correspond
    //à la valeur de fileCategory et renvoyer la valeur d'index

    // Créer l'objet d'envoi POST
    // let workToPost = {
    //     "id": 0,
    //     "title": filePictureTitle.value,
    //     "imageUrl": "string"
    //     "categoryId": "string",
    //     "userId": 0
    // }
});
