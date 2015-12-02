console.log("hello");

/*
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

if(sPage != "index.html"){
	document.getElementById("nav").style.display = "block";
}
*/


function login(){
	console.log("login was pressed");
}

function goSignup(){
	console.log("lol");
	document.getElementById("log").style.display = "none"; 
	document.getElementById("form-signup").style.display = "block"; 
}

function goBack(){
	console.log("back was pressed"); 
	document.getElementById("form-signup").style.display = "none"; 
	document.getElementById("loginform").style.display = "block"; 
}

function signup(){
	console.log("signup was pressed"); 
}

function goHome(){
	  console.log("home");
	  location.href='home.html';
	  document.getElementById("nav").style.display = "block";
}