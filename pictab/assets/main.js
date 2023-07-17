function fadeIn(element, time) {
    var op = 0;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op += 0.1;
    }, time);
}

async function insertRandomPhoto() {
    // Thanks GPT-4!

    // Fetch image data - the response is a Promise
    let response = await fetch("http://localhost:5130/random_photo");

    let oldImg = document.querySelector("#photo img");
    if (oldImg != null) {
        oldImg.remove();
    }

    // Create a blob from the response
    let imgData = await response.blob();

    // Create an object URL for the blob
    let imgURL = URL.createObjectURL(imgData);

    let imgElem = document.createElement("img");
    imgElem.src = imgURL;

    let photoDiv = document.getElementById("photo");
    photoDiv.appendChild(imgElem);

    let photoBgDiv = document.getElementById("photo-bg");
    photoBgDiv.style.backgroundImage = `url(${imgURL})`;
    photoBgDiv.style.backgroundPosition = 'center center';

    fadeIn(photoDiv, 50);
    fadeIn(photoBgDiv, 50);
}

function updateTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();

    // Add leading zeros if necessary
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var timeString = hours + ":" + minutes;
    document.getElementById("current-time").innerText = timeString;
}

document.addEventListener("DOMContentLoaded", function(event) {
    insertRandomPhoto();
    updateTime();
    setInterval(updateTime, 1000);

    const new_photo = document.querySelector("#new-photo button");

    new_photo.addEventListener("click", (event) => {
        insertRandomPhoto();
    });


});
