
const gallery = document.querySelector(".gallery");
const galleryEdit = document.querySelector(".modal-wrapper-edit .edit-gallery");
let filterBar = document.querySelector(".filters");
let modal = document.querySelector(".modal");
let modalWrapperEdit = document.querySelector(".modal-wrapper-edit");
let modalWrapperForm = document.querySelector(".modal-wrapper-form");
const token = window.localStorage.getItem("token");

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
    galleryEdit.innerHTML = '';
    resetPreviews()
};
function resetPreviews() {
    pictureFileReader.abort();
    pictureFile.value = '';
    pictureTitle.value = '';
    pictureCategory.value = 1;
    filePreview.src = "";
    filePreview.style.display = "none";
    fileInput.style.display = "flex";
    submitBtn.classList.add("disabled");
};
function createFigure(content, container) {
    let fig = document.createElement("figure");
    let figImg = document.createElement("img");
    figImg.src = content.imageUrl;
    figImg.alt = content.title;
    let figCaption = document.createElement("figcaption");
    figCaption.innerHTML = content.title;
    fig.append(figImg, figCaption);
    container.appendChild(fig)
}
function generateGalleryContent(content, container) {
    gallery.innerHTML = " ";
    for (work of content) {
        createFigure(work, container)
    };
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
        console.log(allWorksList)
        return allWorksList
    })

    //Génération des boutons de filtres
    .then((allWorksList) => {
        generateGalleryContent(allWorksList, gallery);
        //Récupération des Catégories
        let setCategoriesList = new Set();
        allWorksList.forEach(work => {
            setCategoriesList.add(JSON.stringify(work.category))
        });
        const categories = Array.from(setCategoriesList).map(JSON.parse);

        // Vérification du token
        if (token != undefined) {
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
                openModal(modalWrapperEdit);
                //Contenu de la modale
                const galleryEditContent = allWorksList.map(allWorksList => allWorksList);

                galleryEditContent.forEach((work) => {
                    let editWork = document.createElement("div");
                    editWork.classList.add("work-edit");
                    let editImg = document.createElement("img");
                    let deleteBtn = document.createElement("button");
                    deleteBtn.classList.add("delete-btn");
                    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>`;
                    deleteBtn.addEventListener("click", () => {
                        fetch("http://localhost:5678/api/works/" + work.id, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(response.status)
                                };
                            })
                            .catch(error => console.log('error delete', error));
                    });
                    editImg.src = work.imageUrl;
                    editWork.append(editImg, deleteBtn);
                    galleryEdit.appendChild(editWork)
                });
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
            let categorySelection = document.getElementById("category");
            categories.forEach((categorie) => {
                let option = document.createElement("option");
                option.value = categorie.id;
                option.innerText = categorie.name;
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
            categories.forEach((categorie) => {
                let filterBtn = document.createElement("button");
                filterBtn.classList.add("filter-btn");
                filterBtn.innerText = categorie.name;
                filterBtn.addEventListener("click", () => {
                    OnClickfilter(categorie.name);
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
                    generateGalleryContent(filteredWorks, gallery);
                }
            }
        }
    })
    .catch((error) => {
        const galleryError = document.createElement("p");
        galleryError.innerText = "Une erreur est survenue";
        gallery.appendChild(galleryError)
    });

// Récupération des données du formulaire
const pictureFile = document.getElementById("image");
const filePreview = document.getElementById("preview");
const fileInput = document.querySelector(".file-input")
const submitBtn = document.querySelector(".modal-wrapper-form .modal-btn");
const pictureFileReader = new FileReader();

// Preview de l'image Uploadée
pictureFile.addEventListener("change", function () {
    const selectedFile = pictureFile.files[0];
    const maxSize = 4 * 1024 * 1024;
    if (selectedFile && selectedFile.size > maxSize) {
        alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 4MB.');
        pictureFile.value = '';
    } else {
        if (pictureFile.files && selectedFile) {
            pictureFileReader.onload = function (e) {
                filePreview.src = e.target.result;
                filePreview.style.display = null;
            };
            fileInput.style.display = "none";
            pictureFileReader.readAsDataURL(selectedFile);
        };
    }
});

// Submit du formulaire
const addWorkForm = document.getElementById("add-work-form");
const pictureTitle = document.getElementById("title");
const pictureCategory = document.getElementById("category");
addWorkForm.addEventListener("change", (e) => {
    if (pictureFile.files[0] != null && pictureTitle.value != "") {
        submitBtn.classList.remove("disabled");
    }
})

addWorkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const workToPostFormData = new FormData(addWorkForm)

    fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: workToPostFormData,
    })
        .then(response => {
            return response.json()
        })
        .then(result => {
            const newWork = result;
            createFigure(newWork, gallery);
            closeModal();
        })
        .catch(Error => {
            console.error("Erreur Post")
        });
});
