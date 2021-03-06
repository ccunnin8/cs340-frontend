document.addEventListener("DOMContentLoaded", () => {
    // UPDATE ALBUMS 
    const updateAlbumID = document.querySelector("#album-id");
    const updateAlbumName = document.querySelector("#album-name");
    const searchAlbumForm = document.querySelector("#search-album");
    const albumName = document.querySelector("#update-album-name");
    const artistName = document.querySelector("#update-artist-name")
    const albumID = document.querySelector("#album-id");
    const albumPrice = document.querySelector("#price");
    const albumError = document.querySelector("#album-error");
    const addArtists = document.querySelector("#add-artists");
    const albumGenre = document.querySelector("#update-album-genre");
    const albumYear = document.querySelector("#year");
    const CopiesInStock = document.querySelector("#copies");
    const addArtistButton = document.querySelector("#add-artist");
    const deleteArtist = document.querySelector("#delete-artist");
    const addGenre = document.querySelector("#add-genre");
    const addGenresContainer = document.querySelector("#album-genres");
    const deleteGenre = document.querySelector("#delete-genre");

    searchAlbumForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({ albumID: updateAlbumID.value, albumName: updateAlbumName.value });
        const request = await fetch("/api/getAlbumDetails", {method: "POST", headers, body });
        const data = await request.json();
    
        if (data.length > 0) {
            const genres = data[2];
            const artists = data[1];
            const albumData = data[0]
            albumError.textContent = "";
            albumName.value = albumData[1];
            artistName.value = albumData[4];
            albumPrice.value = albumData[2];
            albumGenre.value = albumData[3];
            albumID.value = albumData[0];
            albumYear.value = albumData[5];
            CopiesInStock.value = albumData[6];
            
            // add extra genres 
            if (genres.length > 1) {
                deleteGenre.className = "";
                const selectGenreParent = albumGenre.parentElement;
                const selectGenreClone = albumGenre.cloneNode(true);
                let count = 1;
                for (let genre of genres.slice(1)) {
                    selectGenreClone.id = `update-album-genre${count++}`;
                    selectGenreClone.value = genre;
                    selectGenreParent.appendChild(selectGenreClone);
                }
            }

            // add extra artists 
            if (artists.length > 1) {
                deleteArtist.className = "";
                const artistNameParent = artistName.parentNode;
                const artistNameClone = artistName.cloneNode(true);
                let count = 1;
                for (let artist of artists.slice(1)) {
                    artistNameClone.id = `update-artist-name${count++}`;
                    artistNameClone.value = artist;
                    artistNameParent.appendChild(artistNameClone)
                }
            }

            // 
        } else {
            albumError.textContent = "album not found!"
        }
    });

    addArtistButton.addEventListener("click", () => {
        deleteArtist.className = "";
        const artistNum = addArtists.children.length;
        const newArtistSelect = artistName.cloneNode(true);
        newArtistSelect.name = `${newArtistSelect.name}${artistNum}`;
        newArtistSelect.id = "update-" + newArtistSelect.name;
        addArtists.appendChild(newArtistSelect);
    });

    deleteArtist.addEventListener("click", () => {
        addArtists.removeChild(addArtists.lastChild);
        if (addArtists.children.length == 1) {
            deleteArtist.className = "is-hidden";
        }
    });

    addGenre.addEventListener("click", () => {
        deleteGenre.className = "";
        const genreNum = addGenresContainer.children.length;
        const newGenreSelect = albumGenre.cloneNode(true);
        newGenreSelect.name = `${newGenreSelect.name}${genreNum}`;
        newGenreSelect.id = "update-album-genre-" + newGenreSelect.name;
        addGenresContainer.appendChild(newGenreSelect);
    });

    deleteGenre.addEventListener("click", () => {
        addGenresContainer.removeChild(addGenresContainer.lastChild);
        if (addGenresContainer.children.length == 1) {
            deleteGenre.className = "is-hidden";
        }
    })

    // update album 
    const updateAlbumForm = document.querySelector("#update-album");
    updateAlbumForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const artists = Array.from(addArtists.children).map(x => x.value);
        const genres = Array.from(addGenresContainer.children).map(x => x.value);

        const body = JSON.stringify({
            albumID: albumID.value, 
            albumName: albumName.value,
            price: albumPrice.value,
            artistID: artistName.value,
            genreID: albumGenre.value,
            CopiesInStock: CopiesInStock.value, 
            ReleasedYear: albumYear.value,
            genres,
            artists
        });

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        try {
            const request = await fetch("/api/updateAlbum", { body, headers, method: "POST" });
            const data = await request.json();
            if (data.status === "fail") {
                alert("there was an error updating your form!");
            } else {
                alert("album updated!");
                updateAlbumForm.reset();
            }
        } catch (e) {
            console.log(e);
            albumError.text = "an error occurred!";
        }
    });

    // UPDATE ARTIST
    const updateArtistForm = document.querySelector("#update-artist");
    const searchArtistForm = document.querySelector("#search-update-artist");
    const searchArtist = document.querySelector("#search-artist")
    const artistSearchError = document.querySelector("#search-artist-error");
    const updateArtistName = document.querySelector("#update-artist-artist-name");
    const updateArtistID = document.querySelector("#update-artist-id");

    const addGenreToArtist = document.querySelector("#add-genre-to-artist");
    const removeGenreFromArtist = document.querySelector("#remove-genre-from-artist");
    const artistGenres = document.querySelector("#artist-genres");

    addGenreToArtist.addEventListener("click", () => {
        removeGenreFromArtist.className = "";
        const genreNum = artistGenres.children.length;
        const newGenreSelect = artistGenres.firstElementChild.cloneNode(true);
        newGenreSelect.name = `${artistGenres.firstElementChild.name}-${genreNum}`;
        newGenreSelect.id = `${artistGenres.firstElementChild.id}-${genreNum}`;
        artistGenres.appendChild(newGenreSelect);
    });

    removeGenreFromArtist.addEventListener("click", () => {
        artistGenres.removeChild(artistGenres.lastChild);
        if (artistGenres.children.length == 1) {
            removeGenreFromArtist.className = "is-hidden";
        }
    });

    searchArtistForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({ artistName: searchArtist.value });
        try {
            const request = await fetch("/api/getArtist", { headers, body, method: "POST"})
            const data = await request.json();
            if (data.length === 0) {
                artistSearchError.textContent = "No artist found with that name";
            } else {
                artistSearchError.textContent = "";
                updateArtistID.value = data;
                updateArtistName.value = searchArtist.value;
            }
        } catch (e) {
            console.error(e, "an error occurred");
        }
    });

    updateArtistForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const genres = Array.from(artistGenres.children).map(x => x.value);
        
        const body = JSON.stringify({
            artistID: updateArtistID.value,
            artistName: updateArtistName.value,
            genres 
        });

        try {
            const request = await fetch("/api/updateArtist", { headers, body, method: "POST"});
            const status = await request.json();
            if (status === "fail") {
                artistSearchError.textContent = "error occurred updating artist";
            } else {
                alert("artist updated!");
                searchArtistForm.reset()
                updateArtistForm.reset();
                artistSearchError.textContent = "";
            }
        } catch (e) {
            console.log(e);
            artistSearchError.textContent = "an error occurred";
        }
    });

    // update genre 

    const updateGenreForm = document.querySelector("#update-genre");
    const oldGenre = document.querySelector("#old-genre");
    const newGenre = document.querySelector("#new-genre");
    const genreError = document.querySelector("#genre-error");
    

    updateGenreForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({ oldGenre: oldGenre.value, newGenre: newGenre.value });
        try {
            const request = await fetch("/api/updateGenre", { method: "POST", headers, body });
            const status = await request.json();
            console.log(status);
            if (status === "fail") {
                genreError.textContent = "genre not found or error occurred";
            } else {
                alert("genre update");
                genreError.textContent = "";
                updateGenreForm.reset();
            }
        } catch (e) {
            console.error(e, "an error occurred");
            genreError.textContent = "an error occurred";
        }
    });

});