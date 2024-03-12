// console.log("we start javascript")

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

const playMusic = (track) => {
    currentSongs.src = `./songs/${track}`;
    currentSongs.play();
}


// const playMusic = (track) => {
//     let audio = new Audio(`./songs/${track}`);
//     audio.addEventListener('error', (event) => {
//         console.error('Error loading audio:', event);
//     });
//     audio.play();
// }

async function main(){
    let songs = await getSongs();
    console.log(songs);

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
    
} 

main();