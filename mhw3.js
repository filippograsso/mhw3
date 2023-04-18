//Edamam

const num_risultati = 10;

const edamam_key='d8082c13616c63fbe41ab602f2ff8ba6';
const edamam_id='3f529e83'
const edamam_endpoint = 'https://api.edamam.com/api/recipes/v2';

function onJsonEdamam(json){
    console.log(json);
    let container = document.querySelector('#ricette');
    container.innerHTML = '';
    if(json.hits.length == 0){
        let section = document.createElement('section');
        section.classList.add("errore");
        let errore = document.createElement('p');
        errore.innerText = "Nessun risultato trovato...";
        section.appendChild(errore);
        container.appendChild(section);
        container.appendChild(document.createElement('hr'));
    }else
    for(let i=0; i<num_risultati; i++){
        result = json.hits[i].recipe;
        let section = document.createElement('section');
        let title = document.createElement('p');
        title.classList.add("title");
        title.innerText = result.label;
        let div = document.createElement('div');
        div.classList.add("recensione");
        let img = document.createElement('img');
        img.src = result.image;
        let p = document.createElement('p');
        p.innerText = 'Calories: ' + Math.round(result.calories) + 'kJ';
        let ul = document.createElement('ul');
        span = document.createElement('span');
        span.innerText = "Ingredients:";
        ul.appendChild(span);
        for(ingredient of result.ingredients){
            li = document.createElement('li');
            li.innerText = ingredient.text;
            ul.appendChild(li);
        }
        div.appendChild(img)
        p.appendChild(ul);
        div.appendChild(p);
        section.appendChild(title);
        section.appendChild(div);
        container.appendChild(section);
        container.appendChild(document.createElement('hr'));
    }

}

function onResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
}

function search(event){
    event.preventDefault();
    let content = encodeURIComponent(document.querySelector('#search').value);
    console.log('Effettuo ricerca in Edamam di ' + content);
    let url = edamam_endpoint + '?app_id=' + edamam_id + '&app_key=' + edamam_key + '&type=public&q=' + content;
    fetch(url).then(onResponse).then(onJsonEdamam);
}

document.querySelector('form').addEventListener('submit', search);
let url = edamam_endpoint + '?app_id=' + edamam_id + '&app_key=' + edamam_key + '&type=public&q=chicken';
fetch(url).then(onResponse).then(onJsonEdamam);


//Spotify

const spotify_client_id ='fc70cd2bc5d7472488ead71cefcfdd5a';
const spotify_client_secret = '5dbc67d660f242d9895d59fc70195a07';
const spotify_endpoint = 'https://api.spotify.com/v1/playlists/2DXa91nVzkeqk4DI4F0La9/tracks';
const spotify_endpoint_token = 'https://accounts.spotify.com/api/token';
let token;
let audio = new Audio();
let prec;
audio.onended = function() {
  console.log("The audio has ended");
  prec.querySelector('.img-container div').classList.remove('pause');
};

function play(event){
  let link = event.currentTarget.dataset.url;
  if(prec){
    prec.querySelector('.img-container div').classList.remove('pause');
  }
  if(audio.paused == false && audio.src == link){
    audio.pause();
    audio.currentTime = 0;
    prec = event.currentTarget;
  }else{
    audio.src = link;
    audio.play();
    event.currentTarget.querySelector('.img-container div').classList.add('pause');
    prec = event.currentTarget;
  }
}

function onJsonSpotify(json){
    console.log(json);
    let container = document.querySelector("#spotify");

    for(item of json.items){
      if(item.track.preview_url){
        item = item.track;
        let title = item.name;
        let artist = item.artists[0].name;
        let cover = item.album.images[1].url;
        let song = document.createElement('section');
        song.classList.add('song');
        song.dataset.url = item.preview_url;
        song.addEventListener('click', play)
        let h3 = document.createElement('h3');
        h3.innerText = title;
        let h4 = document.createElement('h4');
        h4.innerText = artist;
        let img_container = document.createElement('div');
        img_container.classList.add('img-container');
        let img = document.createElement('img');
        img.src = cover;
        let overlay = document.createElement('div');
        img_container.appendChild(overlay);
        img_container.appendChild(img);        
        song.appendChild(img_container);
        song.appendChild(h3);
        song.appendChild(h4);
        container.appendChild(song);
      }
    }
}

function onJsonToken(json)
{
  console.log(json)
  token = json;

  fetch(spotify_endpoint,
    {
    headers:
      {
        'Authorization': token.token_type + ' ' + token.access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  ).then(onResponse).then(onJsonSpotify);
}

function onTokenResponse(response)
{
  return response.json();
}

fetch(spotify_endpoint_token, {
    method: "post",
    body: 'grant_type=client_credentials',
    headers:
    {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(spotify_client_id + ':' + spotify_client_secret)
    }
   }
).then(onTokenResponse).then(onJsonToken);