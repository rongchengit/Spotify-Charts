import { getAccessToken, getTokenSet, isLoggedIn } from "./spotifyLogin";

interface Playlist{ 
    tracks: Tracks//because its a object we have to create a interface for it
}

interface Tracks{
    items: TrackItem[]; //it is a array of track objects
}

interface TrackItem{
    track: Track
}

interface Track{
    artists: Artist[];
    id: string;
}

interface Artist{
    id: string;
    name: string;
}

interface ArtistGenre{
    id: string;
    name: string;
    genres: string[];//creates a string array, the ? makes genres optional
    images: Img[];
    popularity: number;
}

interface Img{
    url: string;
}
export interface PlaylistItem{ //object with type string for both id and name
    id: string;
    name: string;
    images: Img[];
    // add any other properties you need from the playlist object
}
//interface followers

export async function fetchUserPlaylists(user_id: string): Promise<PlaylistItem[]>{ //any synchronous function you can use await //its so I dont have to chain //paramenters with user_id//return array of playlist items
  
  const url = `https://api.spotify.com/v1/users/${user_id}/playlists`; //create the url
  const playlistResponse = await fetch(url, {headers: {'Authorization': 'Bearer ' + await getAccessToken(), "Content-Type": "application/json","Accept": "application/json"}});//get the url and play using bearer token
  const playlistdata = await playlistResponse.json();

  const playlistItems = playlistdata.items;
  if(isLoggedIn()) {
    playlistItems.push({
      id: "likedSongs",
      name: "Liked Songs",
      images: []
    }) //add the playlist items in the new braces
  }

  return playlistdata.items;//grabs the playlist data

}

//TODO: call playlist/playlist_id/tracks instead and add batching with limit = 50
export async function fetchPlaylistById(playlist_id: string): Promise<TrackItem[]>{ 
  if(playlist_id === "likedSongs") {
    return fetchCurrentUserLikedList();
  }
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`; //create the url for playlist by ID
  const token = await getAccessToken();
  const playlistResponse = await fetch(url, {headers: {'Authorization': 'Bearer ' + token, "Content-Type": "application/json","Accept": "application/json"}});//get the url and play using bearer token
  const playlists = await playlistResponse.json(); //get response back/ gives all the info about the playlist
  let trackResult = playlists.items; //creates an array with first limit tracks

  if(playlists.total > playlists.limit){
    const numCalls = Math.ceil((playlists.total - playlists.limit)/playlists.limit);// playlist total(1885) - limit(100) / limit(100) = 17.85 and we want the  ceiling so we want 18 calls = math.ceil
    const urls = [] //create an array for spotify
    for(let i = 1; i <= numCalls; i++){
      urls.push(url + "?offset=" + i*playlists.limit); //the pla
    }
    const responses = await Promise.all(urls.map(async u => {
    const resp = await fetch(u, {headers: {'Authorization': 'Bearer ' + token, "Content-Type": "application/json","Accept": "application/json"}});
    return resp.json();
    }));//contains array of call elements and each response contains the entire spotifyCalls returns

   responses.forEach(pr => {
      trackResult = trackResult.concat(pr.items); //this puts all the playlist called together
    })
  }
  return trackResult
}

export async function fetchCurrentUserLikedList(): Promise<TrackItem[]>{ 

  const url = `https://api.spotify.com/v1/me/tracks`; //create the url for current user and get limit which is 50
  const token = await getAccessToken();
  const playlistResponse = await fetch(url+"?limit=50", {headers: {'Authorization': 'Bearer ' + token, "Content-Type": "application/json","Accept": "application/json"}});//get the url and play using bearer token and setting the initial limit to 50
  const playlists = await playlistResponse.json(); //get response back/ gives all the info about the playlist
  let trackResult = playlists.items; //creates an array with first limit tracks

  if(playlists.total > playlists.limit){
    const numCalls = Math.ceil((playlists.total - playlists.limit)/playlists.limit);// playlist total(1885) - limit(100) / limit(100) = 17.85 and we want the  ceiling so we want 18 calls = math.ceil
    const urls = [] //create an array for spotify
    for(let i = 1; i <= numCalls; i++){
      urls.push(url + "?limit=50&offset=" + i*playlists.limit);//setting the offset and we want to set the limit so ?limit=50&offset= //offset is for looping through the track so it doesnt get the same 50 tracks
    }
    const responses = await Promise.all(urls.map(async u => {
    const resp = await fetch(u, {headers: {'Authorization': 'Bearer ' + token, "Content-Type": "application/json","Accept": "application/json"}});
    return resp.json();
    }));//contains array of call elements and each response contains the entire spotifyCalls returns

   responses.forEach(pr => {
      trackResult = trackResult.concat(pr.items); //this puts all the playlist called together
    })
  }
  return trackResult
}

export async function fetchArtists(artistIDs: string[]): Promise<ArtistGenre[]>{
  
    const batchedArtistIDs = splitArrayIntoBatches(artistIDs, 50) //counts to 50 then split, seperating the amount into batches
    let urls = []; //space for url array
    for (let i = 0; i < batchedArtistIDs.length; i++){
        urls.push(`https://api.spotify.com/v1/artists?ids=${batchedArtistIDs[i].join()}`);//push list of artist ids from 0-49 and appended together into the url array. basically making urls
    }
    const access_token = await getAccessToken();
    const artistResponse = await Promise.all(urls.map(url => fetch(url, {headers: {'Authorization': 'Bearer ' + access_token, "Content-Type": "application/json","Accept": "application/json"}}))) //fetching multiple times for the promise all response
    
    let artists = [];
    for(let artist of artistResponse){
        const a = await artist.json();
        artists.push(...a.artists) //adding the ... takes out all the elements and pushes 1 at a time from 1 array to another, so non nested array resulting in artist in a single array
    } 
    return artists;
}

function splitArrayIntoBatches(arr: string[], batchSize: number) {
    const result = [];
    const length = arr.length;
    let i = 0;
    while (i < length) {
      result.push(arr.slice(i, i + batchSize));
      i += batchSize;
    }
    return result;
  }

//can be checked by getPRofile()
//console response to put that info into p element

// async function fetchFollowers = {
//   const url = `https://api.spotify.com/v1/me/following/contains`; //create the url for check If users follows artist or users
//   const token = await getAccessToken();
//   const followerResponse = await fetch(url, {headers: {'Authorization': 'Bearer ' + token, "Content-Type": "application/json","Accept": "application/json"}});//get the url and play using bearer token
//   const followers = await followerResponse.json();
// }