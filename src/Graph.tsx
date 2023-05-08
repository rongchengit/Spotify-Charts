//export is public functions that can be imported in from other files
// function bubblegraph grabs variable playlistID
//all the functions i write in spotifyUtils I will call it in graph
import * as react from "react";
import { fetchArtists, fetchPlaylistById } from "./spotifyUtils";
import './Graph.css'; //importing graph css
import buildGraph from "./bubbleGraph"; //importing everything from bubbleGraph

interface IProps{
  playlistID:string;
  imageURL:string | undefined; //from Home.tsx html

}
interface IState{
  data: TrackData[]
}

export interface TrackData{ //adding a ?: makes it optional
  name: string;
  count: number;
  image: string;
  genres?: string[]; 
  popularity?: number;

}
//create bubble graph 
export default class Graph extends react.Component<IProps, IState>{
  constructor(props: IProps) {
    super(props);  
    this.state = {
      data: []
    }
  }
  
  //Component is UseEffect which is the backend request to the spotify api
  componentDidMount() {
    if(this.props.playlistID){ //grabs playlistid from props
      const data: TrackData[] = []; //declaring the data for the playlist
      fetchPlaylistById(this.props.playlistID).then(playlist => {
      
          const trackInfo = playlist.map((item) =>({
            id: item.track.id, 
            genres: [] as string[],
            // artistIDs: item.track.artists.map(artist => artist.id)
            artistNames: item.track.artists.map(artist => artist.name), //grabs artist names from the artist map
            artistIds: item.track.artists.map(artist => artist.id),// grabs artist ids from the artist map
            artistPopularity: -1
          }))//grab the ID and Arist , and genre

          const artistIDs = trackInfo.flatMap(track => track.artistIds) 
          const uniqueArtistIDs = artistIDs.filter((value, index) => value && artistIDs.indexOf(value) === index);
          if(uniqueArtistIDs.length){
            fetchArtists(uniqueArtistIDs).then(artists => {
                artists.forEach(artist => {
                    trackInfo.filter(track => track.artistIds.includes(artist.id)) //get all artist and loop through and look through track info and give me all the track from that artist
                        .forEach(track => {
                          track.genres.push(...artist.genres)
                          track.artistPopularity = artist.popularity
                        }) //pushes the genre[] elements into trackInfo genres:[] as string []
                })
                trackInfo.forEach((track) => { //loop through all the trackInfo
                  track.artistNames.forEach(artistName =>{ //for each track grab the artist name
                    const storedArtistName = data.find(trackData => trackData.name === artistName); //check the data: TrackData[] if its already in the data array
                    if(storedArtistName){ 
                      storedArtistName.count++; //if the artist name is in the data array increase artist name count
                    }
                    else{
                      const images = artists.find(artist => artist.name === artistName)?.images; //find the correct artist from the track info
                      let image = "https://media.istockphoto.com/id/1344687455/vector/question-sing-flat-icon-vector-illustration-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=ZU6kq0hQacI7mZoYuXTqXF8KsgNnbCRaxDm_nAIdCAw=" //if there isnt a image then default
                      if(images?.length){ //if we find the artist we get the images
                        image = images[0].url // if there are images take the image
                      }
                      data.push({name: artistName, count: 1, image, genres: track.genres, popularity: track.artistPopularity }) //if not in the data array then add the artist into the data: TrackData[] and add 1 and same for image
                    }
                  }) 
                })
                this.setState({data: data.sort((a,b) => a.count > b.count ? -1 : 1).slice(0, 100)})
                buildGraph(data.sort((a,b) => a.count > b.count ? -1 : 1).slice(0, 100), this.props.imageURL!, "count" ) //slice is viewign top 50
            })
          }
          else{
            //comment to do show default image
          }
      })
    }
    //build the graph using this.buildGraph
  }
    //render the svg and graph
  render() {
    return (
      <div>
        <div className="center" id="bubbleChart"></div>

        <div>
          
          <button onClick={()=> buildGraph(this.state.data, this.props.imageURL!, "count")}>By Count</button>

          <button onClick={()=> buildGraph(this.state.data, this.props.imageURL!, "popularity")}>By Popularity</button>

        </div>
      </div>
   );
  }
}
