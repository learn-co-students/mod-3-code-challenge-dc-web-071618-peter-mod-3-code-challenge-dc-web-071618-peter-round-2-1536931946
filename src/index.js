document.addEventListener('DOMContentLoaded', function() {
  fetchAllBeers();
})

function fetchAllBeers() {
  fetch('http://localhost:3000/beers')
  .then(res => res.json())
  .then(data => data.forEach(beer => listAllBeersToDom(beer)))
}

function listAllBeersToDom(beer) {
  let beerDetailDiv = document.querySelector('#beer-detail');
  let ulBeerList = document.querySelector('.list-group');

  let beerItem = document.createElement('li');
  beerItem.className = 'list-group-item';
  beerItem.dataset.id = beer.id;
  beerItem.innerText = beer.name;

  beerItem.addEventListener('click', function(event) {
    event.preventDefault();
    fetchBeerDetails(event.target.dataset.id);
    beerDetailDiv.innerHTML = ""
  });

  ulBeerList.appendChild(beerItem);
}

function fetchBeerDetails(id) {
  fetch(`http://localhost:3000/beers/${id}`)
  .then(res => res.json())
  .then(data => renderIndividualBeer(data))
}

function renderIndividualBeer(beerInfo) {
  let beerDetailDiv = document.querySelector('#beer-detail');

  let beerName = document.createElement('h1');
  beerName.innerText = beerInfo.name;

  let beerImage = document.createElement('img');
  beerImage.src = beerInfo.image_url;

  let beerTagline = document.createElement('h3');
  beerTagline.innerText = beerInfo.tagline;

  let beerDescription = document.createElement('textarea');
  beerDescription.innerText = beerInfo.description;

  let saveButton = document.createElement('button');
  saveButton.id = "edit-beer";
  saveButton.dataset.id = beerInfo.id;
  saveButton.className = "btn btn-info";
  saveButton.innerText = "Save";

  saveButton.addEventListener('click', function(event) {
    event.preventDefault();
    patchIndividualBeerInfo(event.target.dataset.id);
    beerDetailDiv.innerHTML = "";
  });

  beerDetailDiv.appendChild(beerName);
  beerDetailDiv.appendChild(beerImage);
  beerDetailDiv.appendChild(beerTagline);
  beerDetailDiv.appendChild(beerDescription);
  beerDetailDiv.appendChild(saveButton);
}

function patchIndividualBeerInfo(id) {
  let descriptionValue = document.querySelector('textarea').value;
  let data = {description: descriptionValue};
  fetch(`http://localhost:3000/beers/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(newDesc => renderIndividualBeer(newDesc))
}
