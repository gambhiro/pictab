let PHOTO = {};

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

async function insertPhoto(show_starred_photo_path = "") {
    // Thanks GPT-4!

    if (show_starred_photo_path == "") {
        let randomPhotoResp = await fetch("http://localhost:5130/get_random_photo");
        PHOTO = await randomPhotoResp.json();
    } else {
        PHOTO = {
            path: show_starred_photo_path,
            is_starred: true,
        };
    }

    let oldImg = document.querySelector("#photo img");
    if (oldImg != null) {
        oldImg.remove();
    }

    let photoResp = await fetch('http://localhost:5130/get_photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "path": PHOTO.path,
        }),
    })

    // Create a blob from the response
    let imgData = await photoResp.blob();

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

    let photoPathDiv = document.getElementById("photo-path");
    photoPathDiv.innerHTML = "<p>" + PHOTO.path + "</p>";

    let starredBtn = document.querySelector("#starred button");
    if (PHOTO.is_starred) {
        starredBtn.classList.add("is-starred");
        starredBtn.textContent = "⭐";
    } else {
        starredBtn.classList.remove("is-starred");
        starredBtn.textContent = "🔘";
    }
}

function toggleStarred(el) {
    if (PHOTO.is_starred) {
        PHOTO.is_starred = false;
        el.classList.remove("is-starred");
        el.textContent = "🔘";
    } else {
        PHOTO.is_starred = true;
        el.classList.add("is-starred");
        el.textContent = "⭐";
    }

    fetch('http://localhost:5130/set_starred', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(PHOTO),
    })
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
    if (SHOW_STARRED_PHOTO_PATH != "") {
        insertPhoto(SHOW_STARRED_PHOTO_PATH);
    } else {
        insertPhoto();
    }

    updateTime();
    setInterval(updateTime, 1000);

    const newPhotoBtn = document.querySelector("#new-photo button");

    newPhotoBtn.addEventListener("click", (event) => {
        insertPhoto();
    });
});
