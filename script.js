// console.log("we start javascript")

let songs;
let currFolder;

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

let currentSongs = new Audio();

async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for(let index = 0; index<as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            let urlParts = element.href.split('/');
            let filename = urlParts[urlParts.length - 1];
            songs.push(filename);
        }
    } 


    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUl.innerHTML = " ";
    for (const song of songs) {
        const decodedSongName = decodeURIComponent(song);
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./Image/musical-note.png" height="12" alt="">
                                            <div class="info">
                                                <div>${song.replaceAll("%20", " ")}</div>
                                                
                                            </div>
                                            <div class="playnow">
                                                <span>Play Now</span>
                                                <img class="invert" src="./Image/play-button-arrowhead.png" height="12" alt="">
                                            </div>
                                            </li>`
    }
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=> {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


}
 
 
let isPlaying = false;


const playMusic = (track, pouse=false) => {
    const decodedSongName = decodeURIComponent(track);
    currentSongs.src = `./${currFolder}/${track}`;
    if(!pouse){
        currentSongs.play();
        play.src = "./Image/pouse.png";
    }
    document.querySelector(".songInfo").innerHTML = decodedSongName;
    document.querySelector(".songTime").innerHTML = "00.00/00.00"

}

async function displayAlbums() {
    try {
        const response = await fetch('http://127.0.0.1:5500/songs/');
        const html = await response.text();
        const div = document.createElement('div');
        div.innerHTML = html;

        const cortContainer = document.querySelector('.cortContainer');
        const anchors = div.getElementsByTagName('a');

        for (let index = 0; index < anchors.length; index++) {
            const anchor = anchors[index];
            const href = anchor.href;
            if (href.includes('/songs/')) {
                const folder = href.split('/').slice(-2)[1];
                try {
                    const infoResponse = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                    if (!infoResponse.ok) {
                        console.error(`Error fetching metadata for folder '${folder}': ${infoResponse.status} ${infoResponse.statusText}`);
                        continue; // Skip to the next iteration if info.json not found
                    }
                    const infoData = await infoResponse.json();

                    cortContainer.innerHTML += `
                        <div data-folder="${folder}" class="cart">
                            <div class="playbutton hoverPlayButton">
                                <img src="./Image/play-button-arrowhead.png"  alt="" srcset="">
                            </div>
                            <img src="/songs/${folder}/cover.jpeg" alt="" srcset="">  
                            <h1>${infoData.title}</h1>
                            <p>${infoData.description}</p>
                        </div>`;
                } catch (error) {
                    console.error(`Error fetching metadata for folder '${folder}':`, error);
                }
            }
        }

        // Event listener for album click
        Array.from(document.getElementsByClassName('cart')).forEach(cart => {
            cart.addEventListener('click', async item => {
                await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                if (songs.length > 0) {
                    playMusic(songs[0], true);
                }
            });
        });
    } catch (error) {
        console.error('Error in displayAlbums:', error);
    }
}


 
async function main(){
    await getSongs("songs/cs");
    // console.log(songs);
    playMusic(songs[0], true);
    
    //display all the albums on the page 
    displayAlbums();

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
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        let index  = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);
        if((index - 1) >= 0){
            playMusic(songs[index-1]);
        }
        
    })
    
    next.addEventListener("click", () => {
        let index  = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",  (e) => {
        currentSongs.volume = parseInt(e.target.value) / 100;
    })

    document.querySelector(".volume>img", () => {
        if(document.querySelector(".range").getElementsByTagName("input")[0].value = 0){
            e.target.src = e.target.src.replace("/Image/volume.png" ,"/Image/volume-mute.png");
        }
    })

    

    document.querySelector(".volume>img").addEventListener("click", e=>{
        
        if(e.target.src.includes("/Image/volume.png")){
            e.target.src = e.target.src.replace("/Image/volume.png" ,"/Image/volume-mute.png");
            console.log(e.target.src);
            currentSongs.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }else{
            e.target.src = e.target.src.replace("/Image/volume-mute.png", "/Image/volume.png");
            currentSongs.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}  

main();   