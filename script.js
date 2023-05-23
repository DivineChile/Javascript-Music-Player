const titleArtist = document.querySelector("span#titleArtist"),
nameOfSong = document.querySelectorAll("span.name"),
extra = document.querySelector("span.extra"),
wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next");
let progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
showMoreBtn = wrapper.querySelector("#more-music"),
musicList = wrapper.querySelector(".music-list"),
hideMusicBtn = musicList.querySelector("#close");



let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.onload = () => {

    loadMusic(musicIndex); //calling load music function when the window loads
    playingNow();
}

//load music function
function loadMusic(indexNumb) {
    musicName.textContent = allMusic[indexNumb - 1].name;
    musicArtist.textContent = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("span").setAttribute("class", "bi bi-pause-fill");
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("span").setAttribute("class", "bi bi-play-fill");
    mainAudio.pause();
}

//previous music function
function prevMusic() {
    //decrement music index by 1
    musicIndex--;

     //if the music wants to get to previous one and there is no previous one, then reset to the last music.
    if(musicIndex < 1) {
        musicIndex = allMusic.length;
    }
    else {
        musicIndex = musicIndex;
    }
    //call the load music function again after incrementing
    loadMusic(musicIndex);
    //calling the play music function
    playMusic();
    playingNow();
}

// next music function
function nextMusic() {
    //increment music index by 1
    musicIndex++;

    //if the music has played to the last one, reset the value to 1
    if(musicIndex > allMusic.length) {
        musicIndex = 1;
    }
    else {
        musicIndex = musicIndex;
    }

    //call the load music function again after incrementing
    loadMusic(musicIndex);
    //calling the play music function;
    playMusic();
    playingNow();
}

//play or music buton event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// previous music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`; //setting the progress width value to the ui 

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.textContent = `${totalMin}:${totalSec}`;

    });
    // update song current playing time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.textContent = `${currentMin}:${currentSec}`;
});

//update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth; // getting width of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
});

// let work on repeat, shuffle song according to icon
const repeatBtn = wrapper.querySelector("#repeat");

repeatBtn.addEventListener("click", () => {
    // first we get the class of the icon and then we'll change accordingly
    let getClass = repeatBtn.classList.value; //getting class of the icon
    
    switch (getClass) {
        case "bi bi-repeat":
            repeatBtn.classList.value = "bi bi-arrow-clockwise";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "bi bi-arrow-clockwise":
            repeatBtn.classList.value = "bi bi-shuffle";
            repeatBtn.setAttribute("title", "Playlist shuffled");
            break;
        case "bi bi-shuffle":
            repeatBtn.classList.value = "bi bi-repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getClass = repeatBtn.classList.value; //getting class of the icon
    
    switch (getClass) {
        case "bi bi-repeat":
            nextMusic(); // play next music once the current one finishes
            break;
        case "bi bi-arrow-clockwise":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "bi bi-shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);

            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }
            while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(randIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", ()=> {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=> {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for(let i = 0; i < allMusic.length; i++) {
    let liTag = `
        <li li-index="${i + 1}">
            <div class="row">
                <span id="titleArtist"><span class="name">${allMusic[i].name}</span></span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
            <span class="audio-duration" id="${allMusic[i].src}">04:01</span>
        </li>
    `;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.textContent = `${totalMin}:${totalSec}`;

        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.textContent = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.textContent = "playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");

    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function showExtra() {
    extra.style.display = "none";
    let emptyArr = [];
    let newNameOfSong;

    //get each of the titles of the songs using the forEach loop;
    nameOfSong.forEach(title => {
        if(title.textContent.length >= 20) {
            //first split the name of the song into  by the space character and assign it to an empty array variable
            emptyArr = title.textContent.split(" ");
            // splice that array variable from 1st to 3rd word and assign it to the newTitle variable you created
            newNameOfSong = emptyArr.splice(0, 3);
            //Then after splicing, you join the spliced words together using the join method and a seperator.
            newNameOfSong = newNameOfSong.join(" ");
            //then you display it into the UI
            title.textContent = newNameOfSong;
            extra.style.display = "inline";
        }
        else {
            extra.style.display = "none";
            console.log("it is less than");
        }
    });
}