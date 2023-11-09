//Page de Login
const logInForm = document.querySelector(".login-block form");
const userEmailInput = document.querySelector("#email");
const userPasswordInput = document.querySelector("#password");

logInForm.addEventListener("submit", (event) => {
    let userEmail = userEmailInput.value;
    let userPassword = userPasswordInput.value;
    event.preventDefault();
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
            throw new Error()
        };
        return response.json()
    })
    .then(result => {
        const connectionStatus = result;
        window.localStorage.setItem("token", connectionStatus.token);
        window.location.href = "./index.html"
    })
    .catch((Error) => {
        const errorMessage = document.querySelector(".login-block .err-message");
        errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
        userEmailInput.value = "";
        userPasswordInput.value = "";
    });
});
