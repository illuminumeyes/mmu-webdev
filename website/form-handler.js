const API_URL = "https://mudfoot.doc.stu.mmu.ac.uk/ash/api/mailinglist";
 
const NAME_REGEX  = /^[A-Za-z\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


function validateName(name){
    return name.length > 0 && NAME_REGEX.test(name);
}

function validateEmail(email){
    return EMAIL_REGEX.test(email);
}

function showMessage(message, isError) {
    let messageDiv = document.getElementById("formMessage");

    messageDiv.textContent = message;
    messageDiv.classList.add("visible");

    if (isError) {
        messageDiv.className = "form-message visible error";
    } else {
        messageDiv.className = "form-message visible success";
    }
}

function clearMessage() {
    let messageDiv = document.getElementById("formMessage");
    messageDiv.textContent = "";
    messageDiv.className = "form-message";
}

function onResponse(response) {
    return response.json().then(function(data) {
        if (!response.ok) {
            throw new Error(data.message || "Server error: " + response.status);
        }
        return data;
    });
}

function onSuccess(data) {
    showMessage(data.message || "Successfully subscribed!", "success");
    document.getElementById("newsletterForm").reset();
}

function onError(error) {
    showMessage("Error: " + error.message, "error");
}

function onFinally() {
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = false;
    submitBtn.textContent = "Subscribe";
}

function submitToMailingList(name, email) {
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ name: name, email: email })
    })
    .then(onResponse)
    .then(onSuccess)
    .catch(onError)
    .finally(onFinally);
}

function handleSubmit(e) {
    e.preventDefault();
    clearMessage();
 
    let name  = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
 
    if (!validateName(name)) {
        showMessage("Please enter a valid name.", "error");
        return;
    }
 
    if (!validateEmail(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
    }
 
    submitToMailingList(name, email);
}


function init() {
    document.getElementById("newsletterForm").addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", init);