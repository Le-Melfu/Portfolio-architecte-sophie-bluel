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
            throw new Error("incorrect")
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
        errorMessage.innerText = "Le mot de passe ou le nom d'utilisateur est incorrect";
    });
});
