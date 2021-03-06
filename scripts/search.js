/*
FILE NAME: search.js
WRITTEN BY: Petter
WHEN: 2016 autumn
PURPOSE: search through the website for word the user want to find.
*/

let Timer;
let Timer2;
let same = "";
let count = 0;
let started = false;
let parse = [];
let soke = "";
let pages = [];
let show;
loadDoc(pages,"content.txt",0,0);

//Populating the dropdown with links to the pages found
function dropDown(whatPage,splitWord){
  let div = document.querySelector(".search #dropdown");
  div.innerHTML = "";
  for(let i = 0; i < whatPage.length; i++){
    let pageLink = whatPage[i].split("\\\\");
    if(whatPage[i] == "home"){
      let a = document.createElement("a");
      a.setAttribute("href",".");
      a.innerHTML = "Section: Home";
      div.appendChild(a);
    }
    if(whatPage[i] == "sitemap"){
      let a = document.createElement("a");
      a.setAttribute("href","?page=sitemap");
      a.innerHTML = "Section: Sitemap";
      div.appendChild(a);
    }
    if((pageLink.length > 1)){
      let a = document.createElement("a");
      a.setAttribute("href","?section="+pageLink[0]+"&page="+pageLink[1]);
      a.innerHTML = ("Section: " + containPageNameMoreThan1Word(pageLink[0]) + ", Page: " + containPageNameMoreThan1Word(pageLink[1]));
      div.appendChild(a);
    }
    if((pageLink.length == 1) && whatPage[i] != "home" && whatPage[i] != "sitemap"){
      let a = document.createElement("a");
      a.setAttribute("href","?section="+whatPage[i]);
      a.innerHTML = ("Section: " + containPageNameMoreThan1Word(pageLink[0]));
      div.appendChild(a);
    }
  }
  if((whatPage.length === 0)){
    let a = document.createElement("a");
    a.innerHTML = ("No hits, try remove words or search on something else");
    div.appendChild(a);
  }	
  let show = document.querySelector(".search #dropdown");
  show.style.display = "block";
}
//Checks if the page link consist of more than 1 word
function containPageNameMoreThan1Word(pageLink){
  let splitPageLink = pageLink.split("_");
  for(let i = 0; i < splitPageLink.length; i++){
	if(splitPageLink[i].length < 4){
	  splitPageLink[i] = splitPageLink[i] = splitPageLink[i].toUpperCase();
	}
	if(splitPageLink[i].length >= 4){
	  splitPageLink[i] = splitPageLink[i].charAt(0).toUpperCase() + splitPageLink[i].slice(1);		
	}
  }
  if(splitPageLink.length == 3){
	return (splitPageLink[0] + " og " + splitPageLink[1] + " og " + splitPageLink[2]);
  }
  if(splitPageLink.length == 2){
	return (splitPageLink[0] + " og " + splitPageLink[1]);
  }
  if(splitPageLink.length == 1){
	return splitPageLink[0];
  }
  if(splitPageLink.length > 5){
	return "Something is wrong, no page shall exist of more than 3 nameparts";
  }
	
}
//Takes the search string, split it up, take one word search every page for hit. Then compere pages with hits and sees if every word is on the same page
function close1Index(searchString){
  let splitWord = searchString.split(" ");
  let hits = [];
  let number = 0;
  for(let h = 0; h < splitWord.length; h++){
    for(let i = 0; i < parse.length; i++){
    loop1:for(let j = 0; j < parse[i].length; j++){
        if(splitWord[h]==parse[i][j]){
          hits[number] = pages[0][i];
          number = number + 1;
          break loop1;
        }
	  }
    }
  }
  let sorted_hits = hits.slice().sort();
  let whatPage = [];
  let pageNumberFound = "";
  let pageFound = 0;
  for (let i = 0; i < hits.length; i++) {
	if(pageNumberFound != sorted_hits[i]){
		pageNumberFound = sorted_hits[i];
		pageFound = 0;
	}
	if(pageNumberFound == sorted_hits[i]){
		pageFound = pageFound + 1;
	}
    if(pageFound == splitWord.length){
      whatPage.push(sorted_hits[i]);
    }
  }
  dropDown(whatPage,splitWord);
}

//loads the page, and save it as a array containing every word
function loadDoc(listSave,page,numberOfPage,run) {
  let fileString;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    let page1 = [];
	if(run === 0){
		fileString = this.responseText;
	}
    if(run >= 1){
		fileString = exractBody(this.responseText);
	}
    let cleanString = fileString.replace(/[\?\|!"#¤%&\/\(\)=\+\-'¨\^}{\[\]\$£@:;*`~€<>§,]| (?= )/g, " ");
    let cleanerString = cleanString.replace(/[A-Z]/gi, function myFunction(x){return x.toLowerCase();});
    let word = [];
    let lines = cleanerString.split("\n");
    let words = [];
    for (let i = 0; i < lines.length; i++){
      words.push(lines[i].split(" "));
    }
    for(let i = 0; i < words.length; i++){
      for(let j = 0; j < words[i].length; j++){
        word.push(words[i][j]);
      }
    }
    for(let i = 0; i < word.length; i++){
      page1[i] = word[i];
    }
    listSave[numberOfPage] = page1;
  }
  };
  xhttp.open("GET", "https://build\-a\-pc\.github\.io\\"+page, true);
  xhttp.send();
}
//Extract the body from a page
function exractBody(response) {
  let dom1 = document.createElement("html");
  dom1.innerHTML = response;
  let bodyText = dom1.getElementsByTagName("body")[0].innerHTML;
  return bodyText;
}
//Sees if the same thing has been stored in the input field for the search more than 3 seconds, then exute the rest
function checkTextBox(){
  let searchString = document.getElementById("search-bar");
  if(searchString.value !== ""){
    if(same == searchString.value){
      count = count+1;
    }
    same = searchString.value;
  }
  if(count == 2){
    clearInterval(Timer);
    started = false;
    same = "";
    count = 0;
    soke = searchString;
    let cleanSearchString = searchString.value.replace(/[A-Z]/gi, function myFunction(x){return x.toLowerCase();});
    close1Index(cleanSearchString);
    }
}

//starts the checking of the input field
function start(){
  if(!started){
    started = true;
    Timer = setInterval(checkTextBox, 1000);
    for(let i = 0; i < pages[0].length;i++){
      loadDoc(parse,"pages\\"+pages[0][i]+".inc.html",i,1);
    }
  }
  let show = document.querySelector(".search #dropdown");
  show.style.display = "none";
}
//Stops the checking of the input field
function stop(){
  started = false;
  clearInterval(Timer);
  show = document.querySelector(".search #dropdown");
  Timer2 = setInterval(hideDropDown, 500);
}
//hides the dropdown
function hideDropDown(){
  show.style.display = "none";
  clearInterval(Timer2);
}
