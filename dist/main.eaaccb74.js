"use strict";(self.webpackChunkspotifychart=self.webpackChunkspotifychart||[]).push([[179],{98434:(t,e,a)=>{a(28594),a(35666);var n=a(67294),o=a(20745),i=a(5267),r=a(89250);function c(t){let e="";for(let a=0;a<t;a++)e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62*Math.random()));return e}function s(){return JSON.parse(localStorage.getItem("tokenSet"))}function l(){localStorage.removeItem("tokenSet"),localStorage.removeItem("code"),localStorage.removeItem("code-verifier")}async function p(){const t=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"refresh_token",refresh_token:JSON.parse(localStorage.getItem("tokenSet")).refresh_token,client_id:"98d7d7247b8e4cb3a1c7f6257ee1fa61"})});if(!t.ok)throw new Error("could not get access token via refresh token");const e=await t.json(),a=Date.now()+1e3*e.expires_in;localStorage.setItem("tokenSet",JSON.stringify({...e,expires_at:a}))}async function d(){const t=await fetch("https://accounts.spotify.com/api/token",{method:"POST",body:"grant_type=client_credentials",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json",Authorization:"Basic OThkN2Q3MjQ3YjhlNGNiM2ExYzdmNjI1N2VlMWZhNjE6YWI5NmY2ZjhmYjkxNDFlZGFlMzc0MDg2NDU5ZTMwNDc="}}),e=await t.json();localStorage.setItem("tokenSet",JSON.stringify({access_token:e.access_token,expires_at:Date.now()+36e5}))}async function u(){const t=s();if(!t||!t.refresh_token&&localStorage.getItem("code-verifier")){if(!localStorage.getItem("code")?.length&&window.location.search.length&&localStorage.setItem("code",new URLSearchParams(window.location.search).get("code")),!localStorage.getItem("code-verifier")||!localStorage.getItem("code")?.length)return await d(),s().access_token;await async function(){const t=localStorage.getItem("code-verifier"),e=localStorage.getItem("code");await async function(t){const e=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:"98d7d7247b8e4cb3a1c7f6257ee1fa61",...t})});if(!e.ok)throw new Error("could not get access token");const a=await e.json(),n=a.access_token,o=Date.now()+1e3*a.expires_in;return localStorage.setItem("tokenSet",JSON.stringify({...a,expires_at:o})),n}({grant_type:"authorization_code",code:e,redirect_uri:"https://bublify.net/callback",code_verifier:t})}()}else if(t.refresh_token&&t.expires_at<Date.now()+6e4)await p();else if(!t.refresh_token&&t.expires_at<Date.now()+6e4)return l(),await d(),s().access_token;return s().access_token}function h(){const t=s();return t&&t.refresh_token}var f=a(97296);const m=a.p+"9dd9814f3ed0e17896cd6bd5866882aa.png";let y;function g(t,e,a){function n(t){var e,n,o,c,s;return e="popularity"===a?t.popularity:t.count,n=r,o=i,c=window.innerWidth<600?15:25,s=window.innerWidth<600?60:100,n===o?(c+s)/2:c+(e-n)/(o-n)*(s-c)}const o=t.reduce(((t,e)=>t+e.count),0);let i=t.reduce(((t,e)=>t>("popularity"===a?e.popularity:e.count)?t:"popularity"===a?e.popularity:e.count),1);"popularity"===a&&(i/=.3);const r=t.reduce(((t,e)=>t<("popularity"===a?e.popularity:e.count)?t:"popularity"===a?e.popularity:e.count),i);f.Ys("#bubbleChart").select("svg").remove();const c=f.Ys("#bubbleChart").append("svg").attr("width",window.innerWidth<600?500:"1000").attr("height",window.innerWidth<600?600:"1000");c.append("defs").selectAll("pattern").data(t).enter().append("pattern").attr("id",((t,e)=>e)).attr("x",0).attr("y",0).attr("height",1).attr("width",1).attr("patternUnits","objectBoundingBox").append("image").attr("x",0).attr("y",0).attr("height",(t=>2*n(t))).attr("width",(t=>2*n(t))).attr("preserveAspectRatio","none").attr("xlink:href",(t=>""===t.image?m:t.image));const s=c.append("g").selectAll("circle").data(t).enter().append("circle").attr("r",(t=>n(t))).attr("cx",c.node().clientWidth/2).attr("cy",c.node().clientHeight/2).style("fill",((t,e)=>`url(#${e})`)).attr("stroke","#1DB954").style("stroke-width",4).on("click",(function(t,e){l.style("opacity",1).html("artist: "+e.name+"<br />count: "+e.count+"<br />percentage: "+(100*e.count/o).toFixed(2)+"%<br />genres: "+e.genres?.join(", ")+"<br />popularity: "+e.popularity).style("left",t.pageX+"px").style("top",t.pageY+"px")})).on("mouseleave",(function(t,e){l.transition().duration(500).style("opacity",0)})).call(f.ohM().on("start",(function(t,e){t.active||y.alphaTarget(.03).restart(),e.fx=e.x,e.fy=e.y})).on("drag",(function(t,e){e.fx=t.x,e.fy=t.y})).on("end",(function(t,e){t.active||y.alphaTarget(.03),e.fx=null,e.fy=null}))),l=f.Ys("#bubbleChart").append("div").style("opacity",0).style("position","absolute").attr("class","tooltip").style("background-color","black").style("border-radius","5px").style("padding","10px").style("color","#1DB954");c.insert("image",":first-child").attr("href",""===e?m:e).attr("width",c.node().clientWidth).attr("height",c.node().clientHeight).attr("preserveAspectRatio","xMidYMid slice").style("opacity",.5),y?y.force("collide",f.Hh().strength(.5).radius((t=>n(t))).iterations(1)):y=f.A4v().force("center",f.wqt().x(c.node().clientWidth/2).y(c.node().clientHeight/2)).force("charge",f.q5i().strength(1)).force("collide",f.Hh().strength(.5).radius((t=>n(t))).iterations(1)).force("attract",f.DXo(0,c.node().clientWidth/2,c.node().clientHeight/2).strength(.05)),y.nodes(t).on("tick",(function(t){s.attr("cx",(t=>t.x)).attr("cy",(t=>t.y))}))}class w extends n.Component{constructor(t){super(t),this.state={data:[]}}componentDidMount(){if(this.props.playlistID){const t=[];(async function(t){if("likedSongs"===t)return async function(){const t="https://api.spotify.com/v1/me/tracks",e=await u(),a=await fetch(t+"?limit=50",{headers:{Authorization:"Bearer "+e,"Content-Type":"application/json",Accept:"application/json"}}),n=await a.json();let o=n.items;if(n.total>n.limit){const a=Math.ceil((n.total-n.limit)/n.limit),i=[];for(let e=1;e<=a;e++)i.push(t+"?limit=50&offset="+e*n.limit);(await Promise.all(i.map((async t=>(await fetch(t,{headers:{Authorization:"Bearer "+e,"Content-Type":"application/json",Accept:"application/json"}})).json())))).forEach((t=>{o=o.concat(t.items)}))}return o}();const e=`https://api.spotify.com/v1/playlists/${t}/tracks`,a=await u(),n=await fetch(e,{headers:{Authorization:"Bearer "+a,"Content-Type":"application/json",Accept:"application/json"}}),o=await n.json();let i=o.items;if(o.total>o.limit){const t=Math.ceil((o.total-o.limit)/o.limit),n=[];for(let a=1;a<=t;a++)n.push(e+"?offset="+a*o.limit);(await Promise.all(n.map((async t=>(await fetch(t,{headers:{Authorization:"Bearer "+a,"Content-Type":"application/json",Accept:"application/json"}})).json())))).forEach((t=>{i=i.concat(t.items)}))}return i})(this.props.playlistID).then((e=>{const a=e.map((t=>({id:t.track.id,genres:[],artistNames:t.track.artists.map((t=>t.name)),artistIds:t.track.artists.map((t=>t.id)),artistPopularity:-1}))),n=a.flatMap((t=>t.artistIds)),o=n.filter(((t,e)=>t&&n.indexOf(t)===e));o.length&&async function(t){const e=function(t,e){const a=[],n=t.length;let o=0;for(;o<n;)a.push(t.slice(o,o+50)),o+=50;return a}(t);let a=[];for(let t=0;t<e.length;t++)a.push(`https://api.spotify.com/v1/artists?ids=${e[t].join()}`);const n=await u(),o=await Promise.all(a.map((t=>fetch(t,{headers:{Authorization:"Bearer "+n,"Content-Type":"application/json",Accept:"application/json"}}))));let i=[];for(let t of o){const e=await t.json();i.push(...e.artists)}return i}(o).then((e=>{e.forEach((t=>{a.filter((e=>e.artistIds.includes(t.id))).forEach((e=>{e.genres.push(...t.genres),e.artistPopularity=t.popularity}))})),a.forEach((a=>{a.artistNames.forEach((n=>{const o=t.find((t=>t.name===n));if(o)o.count++;else{const o=e.find((t=>t.name===n))?.images;let i="";o?.length&&(i=o[0].url),t.push({name:n,count:1,image:i,genres:a.genres,popularity:a.artistPopularity})}}))})),this.setState({data:t.sort(((t,e)=>t.count>e.count?-1:1)).slice(0,window.innerWidth<=768?50:100)}),g(t.sort(((t,e)=>t.count>e.count?-1:1)).slice(0,window.innerWidth<=768?50:100),this.props.imageURL,"count")}))}))}}render(){return n.createElement("div",null,n.createElement("div",{className:"center",id:"bubbleChart"}),n.createElement("div",{style:{display:"flex",justifyContent:"center"}},n.createElement("button",{onClick:()=>g(this.state.data,this.props.imageURL,"count")},"By Count"),n.createElement("button",{onClick:()=>g(this.state.data,this.props.imageURL,"popularity")},"By Popularity")))}}var b=a(10657);const k={control:t=>({...t,color:"#5A5A5A",backgroundColor:"#1DB954",borderColor:"transparent",borderRadius:"25px",fontFamily:"Gotham Rounded, sans-serif",fontSize:"24px",width:"100%",maxWidth:"500px",display:"flex",justifyContent:"center",margin:"0 auto",textAlign:"center"}),option:(t,e)=>({...t,backgroundColor:e.isSelected||e.isFocused||e.isActive?"#1DB954":"#191414",color:"#5A5A5A",fontFamily:"Gotham Rounded, sans-serif",fontSize:"24px"}),menu:t=>({...t,backgroundColor:"#191414",overflow:"hidden",position:"relative",width:"100%",maxWidth:"500px",margin:"0 auto",textAlign:"center"}),menuList:t=>({...t,"&::-webkit-scrollbar":{width:"10px"},"&::-webkit-scrollbar-track":{background:"#f1f1f1",borderRadius:"10px"},"&::-webkit-scrollbar-thumb":{background:"#888",borderRadius:"10px"},"&::-webkit-scrollbar-thumb:hover":{background:"#555"}}),singleValue:t=>({...t,color:"#5A5A5A"}),placeholder:t=>({...t,color:"#5A5A5A"})},v=function(){const[t,e]=(0,n.useState)([]),[a,o]=(0,n.useState)(""),[i,r]=(0,n.useState)(),[d,f]=(0,n.useState)(""),m=t=>{(async function(t){const e=`https://api.spotify.com/v1/users/${t}/playlists`,a=await fetch(e,{headers:{Authorization:"Bearer "+await u(),"Content-Type":"application/json",Accept:"application/json"}}),n=await a.json(),o=n.items;return h()&&o.push({id:"likedSongs",name:"Liked Songs",images:[]}),n.items})(t).then((t=>{const a=t.map((t=>({value:t.id,label:t.name,albumImg:t.images[0]?.url??""})));e(a),r(a[0]);const n=a.findIndex((t=>"likedSongs"===t.value));-1!==n&&r(a[n])})).catch((t=>console.error(t)))};return(0,n.useEffect)((()=>{(async function(){if(h()){const t=await fetch("https://api.spotify.com/v1/me",{headers:{Authorization:"Bearer "+await u()}}),e=await t.json();return function(t){const e=s();e.user_id=t,localStorage.setItem("tokenSet",JSON.stringify(e))}(e.id),e}})().then((t=>{t?.id&&(f(t.id),o(t.id),m(t.id))}))}),[]),n.createElement("div",null,n.createElement("div",{style:{display:"flex",alignItems:"center",flexDirection:"column"}},d?n.createElement("div",{style:{display:"flex",alignItems:"center"}},n.createElement("button",{onClick:()=>{l(),e([]),o(""),r(void 0),f("")}},"logout")," ",n.createElement("p",{style:{color:"#1DB954",marginLeft:"10px"}},d)):n.createElement("button",{onClick:async()=>{await async function(){if(localStorage.getItem("code")&&localStorage.getItem("code-verifier")){const t=s();return void(t?.refresh_token&&t.expires_at<Date.now()+6e4&&await p())}let t=c(128);(async function(t){const e=(new TextEncoder).encode(t);return a=await window.crypto.subtle.digest("SHA-256",e),btoa(String.fromCharCode.apply(null,new Uint8Array(a))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");var a})(t).then((e=>{let a=c(16),n=new URLSearchParams({response_type:"code",client_id:"98d7d7247b8e4cb3a1c7f6257ee1fa61",scope:"playlist-read-private user-library-read user-follow-read",redirect_uri:"https://bublify.net/callback",state:a,code_challenge_method:"S256",code_challenge:e});localStorage.setItem("code-verifier",t),window.location.href="https://accounts.spotify.com/authorize?"+n}))}()}},"login")),n.createElement("form",{className:"center",onSubmit:t=>{t.preventDefault(),m(a)}},n.createElement("input",{value:a,className:"defaultInput",type:"text",name:"userID",placeholder:"Username",onChange:t=>{o(t.target.value)}})),n.createElement("div",null,n.createElement(b.ZP,{styles:k,options:t,value:i,onChange:(t,e)=>{t&&r(t)},placeholder:"Spotify Playlist"})),i&&n.createElement(w,{key:i.value,playlistID:i.value,imageURL:i.albumImg}))},S=()=>{const t=(0,r.s0)();return(0,n.useEffect)((()=>{u().then((()=>{t("/")}))}),[t]),n.createElement("div",null)},x=function(){return(0,n.useEffect)((()=>{}),[]),n.createElement(r.Z5,null,n.createElement(r.AW,{path:"/",element:n.createElement(v,null)}),n.createElement(r.AW,{path:"/callback",element:n.createElement(S,null)}))};var _=a(79655);const E=window.__CONFIG__;delete window.__CONFIG__,(0,o.a)(document.getElementById("root"),n.createElement(n.Fragment,null,n.createElement(i.Z.Provider,{value:E},n.createElement(_.VK,null,n.createElement(x,null)))))}},t=>{t.O(0,[736,160],(()=>(98434,t(t.s=98434)))),t.O()}]);
//# sourceMappingURL=main.eaaccb74.js.map