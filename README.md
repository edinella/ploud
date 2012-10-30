# ♫ Play it loud
Collaborative playlist for collective audio

## Motivation
Ploud is designed to be a simple audio playlist, acessible on a local network, managing the local ambient sound on a collaborative way.
That way, people on the same room can share their musical preferences and influence the resultant soundtrack that is playing loud.

## Installation
```npm install ploud -g```

## Usage
* Start application ```npm start ploud -g```
* Tell your friends to open ```http://[your IP]:3000``` in Firefox or Chrome and collaborate including their own songs
* Open ```http://[your IP]:3000``` and choose a song to play it loud

## Server customization
* Server port: ```npm config set ploud:port 3001```
* Library path: ```npm config set ploud:librarypath "./new/path"```