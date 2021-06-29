let listElementNumber = 0;
let userInput = "";
let tekst = "";
let globalDataArray = [];
let tabNumber = 1;

// Ustawienie event listenerów dla guzików
function load()
{
	document.getElementById("submitButton").addEventListener('click', addListElement);
	document.getElementById("saveButton").addEventListener('click', saveData);
	document.getElementById("loadButton").addEventListener('click', loadData);
	document.getElementById("clearButton").addEventListener('click', clearList);
	document.getElementById("addTab").addEventListener('click', addTab);
	document.getElementsByClassName("tab")[0].addEventListener('click', changeTabToClick);
	document.getElementsByClassName("tab")[0].addEventListener('dblclick', changeTabName);
	globalDataArray.push(new Tab (0, "Karta 1"));
}	

function loadChecks() // Wczytanie słuchaczy eventów guzika check
{
	var ice = document.getElementsByClassName("icon-check-empty");
	var ic = document.getElementsByClassName("icon-check");

	for (let i = 0; i < ice.length; i++) {
	ice[i].addEventListener('click', check, false);
	}

	for (let i = 0; i < ic.length; i++)	{
		ic[i].addEventListener('click', uncheck, false);
	}
}

function loadTab(nr) {
	const elem = document.getElementById(`tb${nr}`);
	elem.addEventListener('dblclick', changeTabName);
	elem.addEventListener('click', changeTabToClick);
}

// Dodawanie ListElementu
function addListElement()
{
	tekst = document.getElementById("inputText").value;
	if(tekst == "" || tekst == null || tekst == undefined) {alert("Pole nie może pozostać puste")}
	else {
		var listElementHTML = 
		`<div class=\"listElement\" id=\"li${listElementNumber}\">
		<i class=\"icon-cancel\" onclick=\"removeListElement(${listElementNumber})\"></i>
		<i class=\"icon-check-empty\"></i>
		<p>${tekst}</p>
 		</div>`;

		document.getElementById("list").innerHTML += listElementHTML;
	
		document.getElementById("inputText").value = "";

		listElementNumber++;

		loadChecks();
	}
}

// Usuwanie konkretnego listElementu
function removeListElement(ident)
{
	document.getElementById("li"+ident).remove();
}

function getParagraphs() {
	let data = [];
	var rfr = document.querySelectorAll(".listElement>p");
	for (let i = 0; i < rfr.length; i++) {
		const checkCheck = rfr[i].previousElementSibling.classList.contains("icon-check");
		data.push( new Paragraph ( rfr[i].textContent, checkCheck ) );
	}
	return data;
}

function postParagraphs(ID) {
	// Pętla wstawiająca listElementy
	const rfr = document.getElementById("list");
	for(let i = 0; i < globalDataArray[ID].dataArr.length; i++) {
		tekst = globalDataArray[ID].dataArr[i].content;
		var listElementHTML = 
		`<div class=\"listElement\" id=\"li${listElementNumber}\">
		<i class=\"icon-cancel\" onclick=\"removeListElement(${listElementNumber})\"></i>
		<i class=\"icon-check-empty\"></i>
		<p>${tekst}</p>
		  </div>`;

		rfr.innerHTML += listElementHTML;
		if ( globalDataArray[ID].dataArr[i].check ) checkOnLoad(document.getElementById(`li${listElementNumber}`).children[1]);
		listElementNumber++;
	}
	tekst = "";
	loadChecks();
}

function removeParagraphs() {
	// Czyszczenie obecnej listy przed zaczytaniem zapisanej wcześniej listy, ale bez alertu
	const adr = document.querySelectorAll("div.listElement");
	for(let i = 0; i < adr.length; i++) {
		adr[i].remove();
	}	
	listElementNumber = 0; 
}

// Zapis wprowadzonych przez użytkownika akapitów do tablicy "data" oraz zapis data do localStorage
function saveData()
{
	if (confirm("Czy a pewno chcesz zapisać checklisty?"))
	{const elem = document.getElementsByClassName("activeTab")[0];
	const actID = parseInt(elem.id.slice(2));
	globalDataArray[actID].dataArr = getParagraphs();

	rearrangeArray(globalDataArray);
	if (typeof(Storage) !== "undefined") {
		// Store
		localStorage.setItem("savedDataArray", JSON.stringify(globalDataArray));
	}
	else {
		document.getElementById("list").innerHTML = "Zapisywanie nie powiodło się. Twoja przeglądarka nie obsługuje pamięci lokalnej";
	}}
}	

function rearrangeArray(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == undefined) {
			arr.splice(i, 1);
		}
	}
}

// Zaczytanie akapitów z localStorage do tablicy "data" i wsadzanie w listElementy
function loadData()
{

	if (typeof(Storage) !== "undefined") {
		globalDataArray = JSON.parse(localStorage.getItem("savedDataArray"));
	}
	else
	{
		document.getElementById("list").innerHTML = "Wczytywanie nie powiodło się. Twoja przeglądarka nie obsługuje pamięci lokalnej";
	}

	// Czyszczenie obecnej listy przed zaczytaniem zapisanej wcześniej listy, ale bez alertu
	const adr = document.querySelectorAll("div.listElement");
	for(let i = 0; i < adr.length; i++)
	{
		adr[i].remove();
	}	
	listElementNumber = 0; 
	// Pętla usuwająca obecne karty
	const tabs = document.querySelectorAll(".tab");
	for (elem of tabs) { elem.remove(); }

	const rfr = document.getElementById("list");
	const gDA = globalDataArray[0].dataArr;
	tabNumber = 0;
	
	// Pętla wstawiająca karty
	for(let i = 0; i < globalDataArray.length; i++) {
		document.getElementById("addTab").insertAdjacentHTML('beforebegin', `<div class=\"tab\" id=\"tb${tabNumber}\">
			<p>${globalDataArray[i].name}</p>
			<i class=\"icon-cancel\" onclick=\"removeTab(${tabNumber})\"></i>
			</div>`);
		loadTab(tabNumber);
		tabNumber++;
	}

	document.getElementById("tb0").classList.add("activeTab");

	// Pętla wstawiająca listElementy
	for( let i = 0; i < gDA.length; i++ ) {
		tekst = gDA[i].content;
		var listElementHTML = 
		`<div class=\"listElement\" id=\"li${listElementNumber}\">
		<i class=\"icon-cancel\" onclick=\"removeListElement(${listElementNumber})\"></i>
		<i class=\"icon-check-empty\"></i>
		<p>${tekst}</p>
 		 </div>`;

		rfr.innerHTML += listElementHTML;
		if ( globalDataArray[0].dataArr[i].check ) checkOnLoad(document.getElementById(`li${listElementNumber}`).children[1]);
		listElementNumber++;
	}
	tekst = "";
	loadChecks();
}

// Czyszczenie listy
function clearList()
{
	if(confirm("Czy na pewno chcesz wyczyścić listę?"))
	{
		var adr = document.querySelectorAll("div.listElement");
		for(let i = 0; i < adr.length; i++)
		{
			adr[i].remove();
		}	
		listElementNumber = 0;
	};
}

function check()
{
	this.classList.remove("icon-check-empty");
	this.classList.add("icon-check");
	this.removeEventListener('click', check);
	this.addEventListener('click', uncheck);
}

function uncheck()
{
	this.classList.remove("icon-check");
	this.classList.add("icon-check-empty");
	this.removeEventListener('click', uncheck);
	this.addEventListener('click', check);
//	loadChecks();
}

function checkOnLoad (ref) {
	ref.classList.remove("icon-check-empty");
	ref.classList.add("icon-check");
	ref.removeEventListener('click', check);
	ref.addEventListener('click', uncheck);
}

class Paragraph {
	constructor (content, check) {
		this.content = content;
		this.check = check;
	}
}

class Tab {
	constructor (id, name) {
		this.id = id;
		this.name = name;
		this.dataArr = [];
	}
}

function addTab() { // Funkcja tworząca nowe karty

	const tabName = prompt("Wprowadź nazwę karty:", "Nowa karta");
	if (tabName !== null) {
		document.getElementById("addTab").insertAdjacentHTML('beforebegin', `<div class=\"tab\" id=\"tb${tabNumber}\">
			<p>${tabName}</p>
			<i class=\"icon-cancel\" onclick=\"removeTab(${tabNumber})\"></i>
			</div>`);
		changeTabToLast();
		globalDataArray.push(new Tab (tabNumber, tabName));
		loadTab(tabNumber);
		tabNumber++;
	}
}

function changeTabToClick() {
	let actID = document.getElementsByClassName("activeTab")[0].id;
	actID = parseInt(actID.slice(2));
	globalDataArray[actID].dataArr = getParagraphs();

	document.getElementsByClassName("activeTab")[0].classList.remove("activeTab");
	this.classList.add("activeTab");
	removeParagraphs();

	const newID = parseInt(this.id.slice(2));
	postParagraphs(newID);
}

function changeTabToLast() {
	let actID = document.getElementsByClassName("activeTab")[0].id;
	actID = parseInt(actID.slice(2));
	globalDataArray[actID].dataArr = getParagraphs();

	const parent = document.getElementById("tabBox");
	let ID =  parent.lastChild.previousElementSibling.previousElementSibling.id;
	ID = parseInt(ID.slice(2));

	document.getElementsByClassName("activeTab")[0].classList.remove("activeTab");
	document.getElementById(`tb${ID}`).classList.add("activeTab");
	removeParagraphs();
}

function isTherePrevTab(element) {
	if (element.previousElementSibling == null) return false;
	return true;
}

function changeTabToPrev(tabID) {
	if (document.getElementById(`tb${tabID}`) == document.getElementsByClassName("activeTab")[0]) {
		const elem = document.getElementsByClassName("activeTab")[0];
		const actID = parseInt(elem.id.slice(2));
		globalDataArray[actID].dataArr = getParagraphs();
		elem.classList.remove("activeTab");

		removeParagraphs();
		let sibling
		(isTherePrevTab(elem)) ? sibling = elem.previousElementSibling : sibling = elem.nextElementSibling;
		sibling.classList.add("activeTab");
		const newID = parseInt(sibling.id.slice(2));
		postParagraphs(newID);
	}
}

function removeTab(ID) {
	if (document.getElementsByClassName("tab").length > 1 && confirm("Czy na pewno chcesz zamknąć tę kartę?")) {
		document.getElementById(`tb${ID}`).removeEventListener('click', changeTabToClick);
		changeTabToPrev(ID);
		delete globalDataArray[ID];
		document.getElementById(`tb${ID}`).remove();
	}
}

function changeTabName() {
	const NAME = prompt("Podaj nazwę karty", `Karta${this.id.slice(2)}`);
//	const fix = this;
	this.children[0].textContent = NAME;
	globalDataArray[parseInt(this.id.slice(2))].name = NAME;
}