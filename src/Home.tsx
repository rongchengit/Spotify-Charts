import React, {useEffect, useState } from 'react'; //{} only grabs useEffect and useState from react
import Graph from './Graph'; // ./ because its local file 
import './App.css';
import {fetchUserPlaylists} from './spotifyUtils';
import {authorizeLogin,fetchProfile, logout} from './spotifyLogin'
import Select, { ActionMeta, SingleValue } from 'react-select'; //importing the select drop down 
import { customStyles } from './dropdown';

interface OptionType{ //this is for drop down interface
  value: string;
  label: string;
  albumImg?: string; //image for album
}

function Home() {
  const [playlists, setPlaylists] = useState<OptionType[]>([]); //give it the type playlistitem as []
  const [userID, setUserID] = useState<string>("");//userId store as string
  const [selectedOption, setSelectedOption] = useState<OptionType>();//playlistId store as string
  const [loggedInUserID, setLoggedInUserID] = useState<string>("");

  const resetState = () => { //resets everything
    logout(); //also calls logout
    setPlaylists([]);
    setUserID("");
    setSelectedOption(undefined)
    setLoggedInUserID("")
  }

  const setPlaylistDropdown = (userID: string) => {
    fetchUserPlaylists(userID) //return all the playlist items
    .then(playlists =>{
      const options: OptionType[] = playlists.map(playlist => ({ //grabs the id of the playlist and name, and album image
        value: playlist.id, 
        label: playlist.name,
        albumImg: playlist.images[0]?.url ?? "" //mapped to the image url which is a array
      }));
      setPlaylists(options);
      setSelectedOption(options[0])//makes it default to the 1st playlist
      const likedSongsIndex = options.findIndex(option => option.value === "likedSongs");
      if ( likedSongsIndex !== -1 ){
        setSelectedOption(options[likedSongsIndex])
      }
    })
      //store them in setPlaylist variable
    .catch(error => console.error(error));
  }

  const handleUserIDChange = (event:React. ChangeEvent<HTMLInputElement>)=>{ //input field as soon as i type something call this function
    setUserID(event.target.value); //current target grab value
  }

  const handleUserIDSubmit = (event:React.FormEvent<HTMLFormElement>)=> { //react.changeEvent lets the input value change the input
    event.preventDefault();
    setPlaylistDropdown(userID);
  }
  const handlePlaylistClick = (newValue: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => { //button field as soon as i click on it then it calls the function
    if(newValue){
      setSelectedOption(newValue)//current target grab value
    }
  }
  useEffect(() => {
    fetchProfile().then(profile => {
      if(profile?.id){
        setLoggedInUserID(profile.id)
        setUserID(profile.id)
        setPlaylistDropdown(profile.id)
      }
    })
  }, []);


  //everytime we call authorizeLogin we will get the access token = login
  //if the user is logged in then we put his UserName and if not we put the login button
  //and we control the logout() we remove all the Information including the UserName so the if statement is no longer true
return (

    <div>
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        {loggedInUserID ?  (<div style={{display: 'flex', alignItems: 'center'}}>
        <button onClick={resetState}>logout</button> <p style= {{ color: '#1DB954' , marginLeft: '10px'}}>
          {loggedInUserID}
        </p></div>):  <button onClick={async()=>{await authorizeLogin()}}>login</button> }
      </div>

      <form className = "center" onSubmit = {handleUserIDSubmit}>
        <input 
          value = {userID}
          className = "defaultInput" 
          type = "text" name="userID" 
          placeholder ="Username"
          onChange = {handleUserIDChange}/>
      </form>

      <div>
        <Select<OptionType>
          styles = {customStyles}
          options={playlists}
          value ={selectedOption} 
          onChange={handlePlaylistClick}
          placeholder="Spotify Playlist"
        />
      </div >
      {selectedOption && <Graph key = {selectedOption.value} playlistID = {selectedOption.value} imageURL = {selectedOption.albumImg} />}  

    </div> 
  );
}
  export default Home;