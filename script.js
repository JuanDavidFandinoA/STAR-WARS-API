var types = ["people","starships","planets","vehicles","species","films"]
var Tipos = ["Personajes","Naves Espaciales","Planetas","Vehiculos","Especies","Peliculas"]
var images = ["https://images4.alphacoders.com/132/1327480.png","https://w.wallha.com/ws/11/Fd6yKk3C.png","https://i.pinimg.com/originals/3e/cd/cf/3ecdcf1e38babe4ae5d69724fb3f9413.jpg","https://image.cdn2.seaart.ai/2023-08-29/15670802266487813/9f6e26c395f792a315521383834e2080cb7f314d_high.webp","https://r4.wallpaperflare.com/wallpaper/189/544/844/star-wars-battlefront-ii-b1-battle-droid-star-wars-battlefront-star-wars-wallpaper-6910a81db16aadcb6697b80f50e1f69d.jpg","https://wallpapercave.com/wp/Rc3r14M.jpg"]
var current = "people"
var page = 1
var itemElement = document.querySelector("article#item");
changeThings()

function changeThings(){
    document.querySelector("p#title").className = current;
    document.querySelector("p#selector").textContent = Tipos[types.indexOf(current)];
    document.body.style.backgroundImage = `url(${images[types.indexOf(current)]})`;
    if (current == "people") document.querySelector("nav p#previous").style.color = "transparent"
    else document.querySelector("nav p#previous").style.color = ""
    if (current == "films") document.querySelector("nav p#next").style.color = "transparent"
    else document.querySelector("nav p#next").style.color = ""
    itemElement.style.display = "none"
    reload()
}

document.querySelectorAll("header button").forEach(button => {
    button.addEventListener("click", () => {
        current = button.id;
        changeThings()
    })
})
document.querySelector("nav p#previous").addEventListener("click",() => {
    if (current != "people") current = types[types.indexOf(current) - 1]
    changeThings()
})
document.querySelector("nav p#next").addEventListener("click",() => {
    if (current != "films") current = types[types.indexOf(current) + 1]
    changeThings()
});

function reload(){
    fetch(`https://swapi.dev/api/${current}/?page=${page}`).then((value) => value.json()).then((value) => {
        let listElement = document.querySelector("section#list");

        listElement.replaceChildren();
        value.results.forEach(element => {
            listElement.innerHTML += `<button class="info" id="${element.url.slice(element.url.lastIndexOf("/", element.url.length - 2) + 1, (element.url.length - 1))}">${element.name || element.title}</b>`
        });
        if (value.previous != null)
            listElement.innerHTML += `<button id="previous">Anterior</button>`
        if (value.next != null)
            listElement.innerHTML += `<button id="next">Siguiente</button>`
        listElement.childNodes.forEach(button => {
            if (button.id != "previous" && button.id != "next")
            button.addEventListener("click",showItem(button.id))
        })
        if (value.previous != null)
        listElement.querySelector("button#previous").addEventListener("click",() => {
            page--
            reload()
        })
        if (value.next != null)
        listElement.querySelector("button#next").addEventListener("click",() => {
            page++
            reload()
        })
    })
}

function showItem(id){
    return () => {
        itemElement.style.display = "block"
        fetch(`https://swapi.dev/api/${current}/${id}`).then((value) => value.json()).then((value) => {
            itemElement.querySelector("div h1").textContent = value.name;
            itemElement.querySelector("div div").innerHTML = "" 
            for (const key in value) {
                if (key != "created" && key != "url" && key != "edited")
                itemElement.querySelector("div div").innerHTML += `<h3>${key}</h3><p>${value[key]}</p>`
            }
        });
    }
}