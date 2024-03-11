// console.log("we start javascript")

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

async function main(){
    let songs = await getSongs();
    console.log(songs);

    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./Image/musical-note.png" height="12" alt="">
                                            <div class="info">
                                                <div>${song.replaceAll("(chosic.com), %20%", "")}</div>
                                                <div>Artist name</div>
                                            </div>
                                            <div class="playnow">
                                                <span>Play Now</span>
                                                <img class="invert" src="./Image/play-button-arrowhead.png" height="12" alt="">
                                            </div>
                                            </li>`
    }

    var audio = new Audio(songs[1]);   
    // audio.play();     

    audio.addEventListener("loadeddata", () => { 
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    })
} 

main();