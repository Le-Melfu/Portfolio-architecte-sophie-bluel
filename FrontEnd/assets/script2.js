//Page de Login
const logInForm = document.querySelector(".login-block form");
console.log(logInForm);

logInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let userEmail = document.querySelector("#email").value;
    let userPassword = document.querySelector("#password").value;
    let userAccount = {
        "email": userEmail,
        "password": userPassword
    };
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userAccount)
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Le mot de passe ou le nom d'utilisateur est incorrect")
        }
        return response.json()
    })
    .then(result => {
        const connectionStatus = result;
        window.localStorage.setItem("token", connectionStatus.token);
        return connectionStatus
    })
    .catch(() => {
        console.error()
    });
});

// Création d'un objet 
//   {
//     "email": "string",
//     "password": "string"
//   }



// POST de l'objet



// return si faux (if !response.ok) => user not found => afficher message d'erreur



// return objet si vrai
// {
//     "userId": 1,
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
// } 


// => stocker dans le localStorage jusqu'au logOut(=> vide le localstorage contenant le token)