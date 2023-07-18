async function showAllStarred() {
    let resp = await fetch("http://localhost:5130/get_starred_photos");
    photos = await resp.json();

    let photoListDiv = document.getElementById("photo-list");

    for (i=0; i<photos.length; i++) {
        let path = photos[i];

        let photoResp = await fetch('http://localhost:5130/get_photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "path": path,
            }),
        })

        let linkElem = document.createElement("a");
        linkElem.setAttribute('href', "/?starred_photo_path=" + encodeURI(path));

        let imgData = await photoResp.blob();
        let imgURL = URL.createObjectURL(imgData);
        let imgElem = document.createElement("img");
        imgElem.src = imgURL;

        linkElem.appendChild(imgElem);
        photoListDiv.appendChild(linkElem);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    showAllStarred();
});
