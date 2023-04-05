import React, {useEffect, useState } from 'react'; //{} only grabs useEffect and useState from react
import Graph from './Graph'; // ./ because its local file 
import './App.css';
import {fetchUserPlaylists} from './spotifyUtils';
import {authorizeLogin,fetchProfile,getAccessToken,login, logout} from './spotifyLogin'
import Select, { ActionMeta, SingleValue } from 'react-select'; //importing the select drop down 
import { customStyles } from './dropdown';
import backgroundImage from '/download.png';
import { access } from 'fs';

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

  const handleUserIDChange = (event:React. ChangeEvent<HTMLInputElement>)=>{ //input field as soon as i type something call this function
    setUserID(event.target.value); //current target grab value
  }

  const handleUserIDSubmit = (event:React.FormEvent<HTMLFormElement>)=> { //react.changeEvent lets the input value change the input
    event.preventDefault();
    console.log(playlists)
    fetchUserPlaylists(userID) //return all the playlist items
      .then(playlists =>{
        const options: OptionType[] = playlists.map(playlist => ({ //grabs the id of the playlist and name
          value: playlist.id, 
          label: playlist.name,
        }));
        setPlaylists(options);
        setSelectedOption(options[0])//makes it default to the 1st playlist
      })
        //store them in setPlaylist variable
      .catch(error => console.error(error));
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
      }
    })
  }, []);


  //everytime we call authorizeLogin we will get the access token = login
  //
return (
    <div>
        {loggedInUserID ? <p>
          {loggedInUserID}
          
        </p> :  <button onClick={async()=>{await authorizeLogin()}}>login</button> }
        <button onClick={() => logout()}>logout</button> 

      <form className = "center" onSubmit = {handleUserIDSubmit}>
        <input 
          value = {loggedInUserID}
          className = "defaultInput" 
          type = "text" name="userID" 
          placeholder ="Username"
          // {loggedInUserID && value = {loggedInUserID}} 
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
      {selectedOption && <Graph key = {selectedOption.value} playlistID = {selectedOption.value}/>} 

    </div> 
  );
}
  export default Home;