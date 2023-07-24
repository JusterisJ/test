const buttonLogin = document.querySelector(`.buttonLogin`)
const buttonProfile = document.querySelector(`.buttonProfile`)
const buttonMovies = document.querySelector(`.buttonMovies`)
const buttonReserveSeats = document.querySelector(`.reserveSeats`)
const buttonEditProfile = document.querySelector(`.buttonEditProfile`)
const loginPage = document.querySelector(`.loginPage`)
const mainPage = document.querySelector(`.mainPage`)
const profilePage = document.querySelector(`.profilePage`)
const moviesPage = document.querySelector(`.moviesPage`)
const reservationPage = document.querySelector(`.reservationPage`)
const loginUsername = document.querySelector(`.loginUsername`)

let currentUser = {}
let seatsDiv = document.querySelector(`.seats`)
let selectedSeats = []
let selectedMovie = null

localStorage.getItem(`movies`)
let movies = localStorage.getItem(`movies`) ?
    JSON.parse(localStorage.getItem(`movies`)) : [
    {
        title: `Scarface`,
        poster: `https://flxt.tmsimg.com/assets/p7539_p_v13_af.jpg`,
        description: `In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.`,
        reservedSeats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },
    {
        title: `John Wick`,
        poster: `https://m.media-amazon.com/images/I/81F5PF9oHhL._AC_UF894,1000_QL80_.jpg`,
        description: `An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.`,
        reservedSeats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },
    {
        title: `Mr. Nobody`,
        poster: `https://m.media-amazon.com/images/M/MV5BMTg4ODkzMDQ3Nl5BMl5BanBnXkFtZTgwNTEwMTkxMDE@._V1_.jpg`,
        description: `A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.`,
        reservedSeats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
]

let moviesDiv = document.querySelectorAll(`.movie`)


// Event Listeners

buttonReserveSeats.addEventListener(`click`, event => {
    reserveSeats(selectedMovie)

})

buttonLogin.addEventListener(`click`, event => {
    if (!loginUsername.value) {
        loginUsername.style.border = `red solid 2px`
        document.querySelector(`.loginError`).innerHTML = `Username can't be empty.`
        return
    }
    if (!localStorage.getItem(`users`)) {
        let users = []
        users.push(createNewUser(loginUsername.value))
        localStorage.setItem(`users`, JSON.stringify(users))
    }
    loginPage.classList.add(`dNone`)
    mainPage.classList.remove(`dNone`)
    let allUsers = JSON.parse(localStorage.getItem(`users`))
    // If user already exists
    if (allUsers.find(element => element.username === loginUsername.value)) {
        currentUser = allUsers.find(element => element.username === loginUsername.value);
    } else {
        // Creating new user
        let tempUsers = JSON.parse(localStorage.getItem(`users`))
        tempUsers.push(createNewUser(loginUsername.value))
        localStorage.setItem(`users`, JSON.stringify(tempUsers))
    }
    displayUsername()
    document.querySelector(`.mainPageBigPhoto`).setAttribute(`src`, currentUser.photo)
    document.querySelector(`.mainPageMoviePoster`).setAttribute(`src`, movies[0].poster)
})
buttonProfile.addEventListener(`click`, event => {
    mainPage.classList.add(`dNone`)
    profilePage.classList.remove(`dNone`)
})

buttonMovies.addEventListener(`click`, event => {
    mainPage.classList.add(`dNone`)
    moviesPage.classList.remove(`dNone`)
})

loginUsername.addEventListener(`click`, event => {
    loginUsername.style.border = `black solid 2px`
    document.querySelector(`.loginError`).innerHTML = ``
})

movies.forEach((movie, index) => {
    let moviePoster = document.createElement(`img`)
    moviePoster.setAttribute(`src`, movie.poster)
    let title = document.createElement(`div`)
    title.innerHTML = `${movie.title}`
    let seatsAvailable = document.createElement(`div`)
    seatsAvailable.innerHTML = `Available Seats : ${countAvailableSeats(index)}`

    moviesDiv[index].appendChild(moviePoster)
    moviesDiv[index].appendChild(title)
    moviesDiv[index].appendChild((seatsAvailable))

    moviePoster.addEventListener(`click`, event => {
        reservationPage.classList.remove(`dNone`)
        moviesPage.classList.add(`dNone`)
        generateReservationPage(movie, index)
    })
})
buttonEditProfile.addEventListener(`click`, event => {
    editProfile()

})
function editProfile() {
    let newPhoto = document.querySelector(`.changePhoto`)
    let newUsername = document.querySelector(`.changeUsername`)
    let newGender = document.querySelector(`.changeGender`)

    if (newPhoto.value) {
        currentUser.photo = newPhoto.value
        let allUsers = JSON.parse(localStorage.getItem(`users`))
        let index = allUsers.findIndex(item => currentUser.username === item.username)
        allUsers[index].photo = newPhoto.value
        localStorage.setItem(`users`, JSON.stringify(allUsers))
        currentUser.photo = newPhoto.value
    }
    if (newUsername.value) {
        if (isUsernameTaken(newUsername.value)) return
        let allUsers = JSON.parse(localStorage.getItem(`users`))
        let index = allUsers.findIndex(item => currentUser.username === item.username)
        allUsers[index].username = newUsername.value
        localStorage.setItem(`users`, JSON.stringify(allUsers))
        currentUser.username = newUsername.value
        document.querySelector(`.changeUsernameError`).innerHTML = ``
    }

    currentUser.gender = newGender.selectedOptions[0].value
    displayUsername()

}
function isUsernameTaken(username) {
    let found = JSON.parse(localStorage.getItem(`users`)).find(item => username === item.username)
    if (found) {
        document.querySelector(`.changeUsernameError`).innerHTML = `Username already exists`
        document.querySelector(`.newUsername`).style.border = `2px solid red`
    }
    return found
}
function generateSeats(movie) {
    seatsDiv.innerHTML = ``
    movie.reservedSeats.forEach((seat, seatIndex) => {
        let div = document.createElement(`div`)
        div.classList.add(`dFlex`, `jCenter`, `aCenter`)
        div.addEventListener(`click`, event => {
            if (seat !== currentUser.id && seat !== 0) return
            if (!selectedSeats.includes(seatIndex)) {
                selectedSeats.push(seatIndex)
                div.style.backgroundColor = `green`
            }
        })
        // If seat is already taken
        if(seat) {
            div.classList.add(`seatTaken`)
            let seatUser = findUser(seat)
            // If seat is already taken by user that is logged in
            if (seatUser.id === currentUser.id) {
                div.style.backgroundColor = `yellow`
                div.innerHTML = `My Seat`

            } else {
                // If seat is already taken by different user
                div.innerHTML = `${seatUser.username}`
            }
            // If seat is free
        } else {
            div.classList.add(`seatFree`)
        }
        seatsDiv.appendChild(div)

    })
}
function generateReservationPage(movie, movieIndex) {
    selectedMovie = movieIndex
    document.querySelector(`.reservationPage img`).setAttribute(`src`, movie.poster)
    document.querySelector(`.movieInfo`).innerHTML = movie.description
    document.querySelector(`.movieTitle`).innerHTML = movie.title

    // Generate seats
    generateSeats(movie)

}
function findUser(seatId) {
    return JSON.parse(localStorage.getItem(`users`)).find(user => user.id === seatId)
}
function reserveSeats(movieIndex) {
    selectedSeats.forEach(item => {
        movies[movieIndex].reservedSeats[item] = currentUser.id
    })
    localStorage.setItem(`movies`, JSON.stringify(movies))
    generateSeats(movies[movieIndex])
}
function countAvailableSeats(index) {
    let available = 0
    movies[index].reservedSeats.forEach(item => {
        if (item === 0) available++
    })
    return available
}
function generateId() {
    return Math.random().toString(16).slice(2)
}
function createNewUser(username) {
    let newUser = {
        username: username,
        photo: `https://img.freepik.com/free-icon/user_318-159711.jpg`,
        id: generateId(),
        gender: `Unknown`
    }
    currentUser = newUser
    return newUser
}
function displayUsername() {
    document.querySelectorAll(`.usernameDiv`).forEach(div => {
        div.innerHTML = ``
        let photo = document.createElement(`img`)
        photo.setAttribute(`src`, currentUser.photo)
        div.appendChild(photo)
        div.innerHTML += `${currentUser.username}`
    })
}


