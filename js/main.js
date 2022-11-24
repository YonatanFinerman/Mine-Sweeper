'use strict'
const MINE = '💣'
const EMPTY = ' '
const FLAG = '🏴‍☠️'
var gLives = '❤❤❤'
var isGameOn = false
var gTimer = 0
var isTimerOn = false
var elTimer
var gIsHint = false
var gHints = '💡💡💡'
var gSafeClicks = 3
var gTurns = []
var gIsBeforeTurn = true
var isBoomClicked = false
var isMegaHint = false
var megaHintFirstLoc
var isMegaHitFirstCell = false
var isExterActive = false
var wasExterActive = false
var gBoard
var gLevel = {
    SIZE: 4,
    MINE: 2
}
var gMinesLoc = []









function initGame() {
    isMegaHint = false
    megaHintFirstLoc
    isMegaHitFirstCell = false

    gSafeClicks = 3
    var elSpan = document.querySelector(".safeBtn span")
    elSpan.innerText = gSafeClicks
    gTimer = 0
    isTimerOn = false
    isGameOn = true
    gLives = '❤❤❤'
    gIsHint = false
    gHints = '💡💡💡'
    var btn = document.querySelector(".hint")
    var eltime = document.querySelector("h3 span")
    eltime.innerText = gTimer
    btn.style.display = 'inline'
    btn.innerText = gHints
    var newImg = document.querySelector('.shrek').src = 'img/shrek1.png'
    var elModalWin = document.querySelector('.modalWin')
    elModalWin.style.display = 'none'
    var elModalLose = document.querySelector('.modalLose')
    elModalLose.style.display = 'none'


    gBoard = buildBoard()

    renderBoard(gBoard)
    var lives = document.querySelector('h2 span')
    lives.innerText = gLives




}


// Builds the board
// Set mines at random locations
// Call setMinesNegsCount()
// Return the created board

// function buildBoard() {
//     var board = []
//     for (var i = 0; i < gLevel.SIZE; i++) {
//         board[i] = []
//         for (var j = 0; j < gLevel.SIZE; j++) {
//             var curCell = board[i][j]
//             curCell = {
//                 location: {
//                     i: i,
//                     j: j
//                 },

//                 isShown: false,
//                 isMine: false,
//                 isMarked: true

//             }
//             if (gMinesLoc[0].i === i && gMinesLoc[0].j === j) {
//                 curCell.isMine = true
//             }

//             // curCell.minesAroundCount = countNegsMines(),

//         }

//     }
//     console.log(board)
// }

// function renderBoard(board) {
//     var strHTML = '<table border="1"><tbody>'
//     for (var i = 0; board.length; i++) {
//         strHTML += '<tr>'
//         for (var j =0 ; j<board[0].length; j++){

//             const className = `cell cell-${i}-${j}`
//             strHTML += `<td class="${className}" onclick="onCellClick(this)">?</td>`


//         }
//         strHTML += '</tr>\n'
//     }
//     strHTML += '</tbody></table>'
//     var elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHTML

// }



function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                location: {
                    i: i,
                    j: j
                },
                isShown: false,
                isMine: false,
                isMarked: true

            }


        }
    }

    // createMines(board)
    // addNegsCounter(board)
    console.log(board)
    return board
}

function onCellClick(cell, i, j) {
    if (!isGameOn) return
    if (!isTimerOn) {
        isTimerOn = true
        elTimer = setInterval(timer, 1000)
        createMines(gBoard)
        addNegsCounter(gBoard)

    }
    if (cell.innerText === FLAG || cell.innerText === MINE) return
    if (gIsHint === true && isGameOn) {
        hintUsed(i, j, gBoard)
        setTimeout(function () { hintUsed(i, j, gBoard); }, 1000);
        gHints = gHints.slice(0, -2)
        var btn = document.querySelector(".hint")
        btn.innerText = gHints

        return
    }
    if (isMegaHint && !isMegaHitFirstCell) {
        megaHintFirstLoc = { i: i, j: j }
        isMegaHitFirstCell = true

        return

    }
    if (isMegaHint && isMegaHitFirstCell) {
        MegaHintActive(megaHintFirstLoc.i, megaHintFirstLoc.j, i, j, gBoard)
        setTimeout(function () { MegaHintActive(megaHintFirstLoc.i, megaHintFirstLoc.j, i, j, gBoard); }, 2000);
        var megabtn = document.querySelector(".megaHint")
        megabtn.style.backgroundColor = 'red'

        return
    }
    // if (isExterActive) {
    //     activateExterminator()
    //     addNegsCounter(gBoard)
    //     isExterActive = false

    //     return

    // }


    // if(cell.classList.contains(".closed")===false){

    //     return
    // } 

    var curCell = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].negsCounter

    var lives = document.querySelector('h2 span')
    var elShrek = document.querySelector('shrek')


    cell.innerText = curCell
    cell.classList.remove("closed")
    gBoard[i][j].isShown = true

    if (gBoard[i][j].negsCounter === EMPTY && !gBoard[i][j].isMine) {
        revealNegs(i, j, gBoard, cell)
    }
    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        gLives = gLives.slice(0, -1)
        lives.innerText = gLives
        if (gLives.length === 2) {
            var newImg = document.querySelector('.shrek').src = 'img/shrek2.png'
        }
        if (gLives.length === 1) {
            var newImg = document.querySelector('.shrek').src = 'img/shrek3.png'
        }



        if (gLives.length === 0) {
            isBoomClicked = false
            gLives = '❤❤❤'
            var newImg = document.querySelector('.shrek').src = 'img/shrek4.png'
            gameOver()
        }
    }
    var isWin = checkWin()
    if (isWin) {
        isBoomClicked = false
        victory()
    }

}
function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isShown) return false
        }
    }
    if (gLives.length) {
        gLives = '❤❤❤'
        return true
    }

}
function gameOver() {
    clearInterval(elTimer)
    isGameOn = false
    var elMoadl = document.querySelector('.modalLose')
    // var elMoadlSpan = document.querySelector(".won")
    elMoadl.style.display = 'block'
    // elMoadlSpan = 'LOST😿'
    var audio = new Audio('audio/lose.wav')
    audio.play()
    isMegaHint = false
    megaHintFirstLoc
    isMegaHitFirstCell = false



}

function addNegsCounter(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var counter = countNegs(board[i][j].location.i, board[i][j].location.j, board)
            // board[i][j].negsCounter = countNegsMines(board[i][j], board)
            if (counter === 0) {
                board[i][j].negsCounter = EMPTY
                continue
            }
            board[i][j].negsCounter = counter
            // board[i][j].negsCounter = countNegs(board[i][j].location.i,board[i][j].location.j,board)
        }
    }
}



function createMines(board) {
    var counter = 0

    if (!isBoomClicked) {
        for (var i = 0; i < gLevel.MINE; i++) {
            createMine(board)
        }

    } else {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                counter++
                if (counter % 7 === 0) {
                    gBoard[i][j].isMine = true
                }
            }
        }

    }



}


function createMine(board) {
    const i = getRandomInt(0, gLevel.SIZE)
    const j = getRandomInt(0, gLevel.SIZE)
    // console.log(i, j)
    if (board[i][j].isMine === true) createMine(board)
    else board[i][j].isMine = true


    // var mine = {

    //     i: getRandomInt(0, gLevel.SIZE),
    //     j: getRandomInt(0, gLevel.SIZE)


    // }
    // gMinesLoc.push(mine)
    // console.log(mine)
}
function onBoomClick() {


}


function onHandleKey(ev) {
    console.log(ev)

}

function victory() {
    clearInterval(elTimer)
    isGameOn = false
    var elMoadl = document.querySelector('.modalWin')
    // var elMoadlSpan = document.querySelector(".won")
    elMoadl.style.display = 'block'
    var newImg = document.querySelector('.shrek').src = 'img/shrek1.png'

    // var elModal = document.querySelector('.modal')
    // var elSpan = document.querySelector('h3 span')
    // elSpan.innerText='WON🏆'
    // elModal.style.display=block
    var audio = new Audio('audio/win.wav')
    audio.play()
    isMegaHint = false
    megaHintFirstLoc
    isMegaHitFirstCell = false

}

function changeLevel(el) {
    if (el.innerText === "Easy😴") {
        gLevel.SIZE = 4
        gLevel.MINE = 2
        clearInterval(elTimer)
        isGameOn = false
        isBoomClicked = false
        isMegaHint = false
        megaHintFirstLoc
        isMegaHitFirstCell = false
    }
    else if (el.innerText === "Midium😃") {
        gLevel.SIZE = 8
        gLevel.MINE = 14
        clearInterval(elTimer)
        isGameOn = false
        isBoomClicked = false
        isMegaHint = false
        megaHintFirstLoc
        isMegaHitFirstCell = false
    }
    else if (el.innerText === "Hard🤬") {
        gLevel.SIZE = 12
        gLevel.MINE = 32
        clearInterval(elTimer)
        isGameOn = false
        isBoomClicked = false
        isMegaHint = false
        megaHintFirstLoc
        isMegaHitFirstCell = false
    }
}

function onRightClick(cell, i, j) {
    if (!isGameOn) return
    if (!isTimerOn) {
        isTimerOn = true
        elTimer = setInterval(timer, 1000)
        createMines(gBoard)
        addNegsCounter(gBoard)
    }
    if (!cell.classList.contains("closed")) return
    cell.innerText = FLAG
    cell.classList.remove("closed")
    // oncontextmenu="onRightClick(event)"
    var elBoard = document.querySelector('.board');
    gBoard[i][j].isShown = true

    return false
}

function timer() {
    var elSpan = document.querySelector('h3 span')
    gTimer++
    elSpan.innerText = gTimer

}

function useHint() {
    gHints = gHints.slice(0, -2)
    gHints += '🔎'
    var btn = document.querySelector(".hint")
    btn.innerText = gHints
    gIsHint = true
    if (!gHints) {
        btn.style.display = 'none'
    }

}

function onSafeClick() {
    if (!gSafeClicks) return
    gSafeClicks--
    var elSpan = document.querySelector(".safeBtn span")
    elSpan.innerText = gSafeClicks
    const i = getRandomInt(0, gBoard.length)
    const j = getRandomInt(0, gBoard[0].length)
    if (gBoard[i][j].isMine || gBoard[i][j].isShown) {
        onSafeClick()
    }
    else {
        renderCell({ i: i, j: j }, 'safe')
        setTimeout(function () { renderCell({ i: i, j: j }, 'safe'); }, 2000);

    }

}
// failed Undo btn
// function saveLastTurn() {

//     var beforeTurn = []
//     var afterTurn = []
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[0].length; j++) {
//             if (gIsBeforeTurn) {
//                 if (gBoard[i][j].isShown) {
//                     beforeTurn.push({ isShow: true, i: i, j: j })
//                 }
//                 else if (!gBoard[i][j].isShown) {
//                     beforeTurn.push({ isShow: false, i: i, j: j })
//                 }
//             }
//             else {
//                 if (gBoard[i][j].isShown) {
//                     afterTurn.push({ isShow: true, i: i, j: j })
//                 }
//                 else if (!gBoard[i][j].isShown) {
//                     afterTurn.push({ isShow: false, i: i, j: j })
//                 }
//             }

//         }
//     }
//     if (gIsBeforeTurn) {

//         gIsBeforeTurn = false
//         return beforeTurn
//     }
//     else if (!gIsBeforeTurn) {

//         gIsBeforeTurn = false
//         return afterTurn

//     }
// }


// function compareTurns(beforeTurn, afterTurn) {


// }

function onBoomClick() {
    isBoomClicked = true
    initGame()
}
// crushes the site :/
// function activateExterminator() {
//     var counter = 0
//     while (counter < 3)
//         for (var i = 0; i < gBoard.length; i++) {
//             for (var j = 0; j < gBoard[0].length; j++) {
//                 if (gBoard[i][j].isMine) {
//                     location = { i: i, j: j }
//                     gBoard[i][j].isMine = false
//                     renderCell(location, 'safe')
//                     setTimeout(function () { renderCell({ i: i, j: j }, 'safe'); }, 2000);
//                     counter++

//                 }
//             }
//         }
//     isExterActive = false
// }

// function onClickExterminator(elbtn) {
//     if (!wasExterActive) {
//         isExterActive = true
//         wasExterActive = true
//         elbtn.style.backgroundColor = 'black'
//     }


// }

