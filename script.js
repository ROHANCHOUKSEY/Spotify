// console.log("we start javascript")

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

let currentSongs = new Audio();

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let index = 0; index<as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    } 

    return songs;
 
} 
 
let isPlaying = false;


const playMusic = (track, pouse=false) => {
    currentSongs.src = `./songs/${track}`;
    if(!pouse){
        currentSongs.play();
        play.src = "./Image/pouse.png";
    }
    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00.00/00.00"

}

async function main(){
    let songs = await getSongs();
    console.log(songs);
    playMusic(songs[0], true);
    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./Image/musical-note.png" height="12" alt="">
                                            <div class="info">
                                                <div>${song.replaceAll("%20", " ")}</div>
                                                <div>Rohan</div>
                                            </div>
                                            <div class="playnow">
                                                <span>Play Now</span>
                                                <img class="invert" src="./Image/play-button-arrowhead.png" height="12" alt="">
                                            </div>
                                            </li>`
    }
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=> {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", () => {
        if(currentSongs.paused){
            currentSongs.play();
            play.src = "./Image/pouse.png";
        }else{
            currentSongs.pause();
            play.src = "/Image/play-button.png";
        }
    })

    currentSongs.addEventListener("timeupdate", () => {
        const currentTime = formatTime(currentSongs.currentTime);
        const duration = formatTime(currentSongs.duration);
        document.querySelector(".songTime").innerHTML = `${currentTime}/${duration}`;

        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%";
    })

    document.querySelector(".sheekbar").addEventListener("click", (e)=> {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent  + "%"
        currentSongs.currentTime = (percent * (currentSongs.duration)) / 100;
    })

    currentSongs.addEventListener("ended", ()=>{
        play.src = "./Image/play-button.png";
    })
    

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".lefthamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })
    

} 

main(); 