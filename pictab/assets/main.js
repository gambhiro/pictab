async function insertRandomPhoto() {
    // Thanks GPT-4!

    // Fetch image data - the response is a Promise
    let response = await fetch("http://localhost:5130/random_photo");

    // Create a blob from the response
    let imgData = await response.blob();

    // Create an object URL for the blob
    let imgURL = URL.createObjectURL(imgData);

    // Create new image element
    let imgElem = document.createElement("img");

    // Set img src to object URL
    imgElem.src = imgURL;

    // Select div with id "photo"
    let photoDiv = document.getElementById("photo");

    // Append the new image to the div
    photoDiv.appendChild(imgElem);

    let photoDivBg = document.getElementById("photo-bg");
    photoDivBg.style.backgroundImage = `url(${imgURL})`;
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
});
