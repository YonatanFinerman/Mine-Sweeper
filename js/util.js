'use strict'
var gIsDarkOn = false
var megaHintCounter = 0

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function renderBoard(board) {
    var strHTML = '<table border="1"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const className = `cell closed cell-${i}-${j}`
            var cellData = 'data-i="' + i + '" data-j="' + j + '"'

            strHTML += `<td class="cell ${className}" ${cellData} onclick="onCellClick(this, ${i}, ${j})" oncontextmenu="onRightClick(this, ${i}, ${j})"></td>`



        }



        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML


}




function countNegsMines(cell, board) {
    var negsCounter = 0

    // console.log(gGamerPos.i)
    for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
        if (i < 0 || i > board.length) continue
        for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {

            if (j < 0 || j > board[0].length) continue
            if (i === cell.location.i && j === cell.location.j) continue
            if (cell.isMine === true) negsCounter++
        }
    }

    return negsCounter


}
function countNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine === true) negsCount++
            // if (mat[i][j]) negsCount++
        }
    }
    return negsCount
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive

}


// its either this or stack - overFlow
function fullExepand(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var curCelloc = { i: i, j: j }

            if (j < 0 || j >= mat[i].length) continue

            renderCell(curCelloc, mat[i][j].negsCounter)
            gBoard[i][j].isShown = true
            if (gBoard[i][j].negsCounter === EMPTY && !gBoard[i][j].isMine) {
                fullExepandv2(i, j, mat)
            }
        }
    }
}
function fullExepandv3(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var curCelloc = { i: i, j: j }

            if (j < 0 || j >= mat[i].length) continue

            renderCell(curCelloc, mat[i][j].negsCounter)
            gBoard[i][j].isShown = true
            // if (gBoard[i][j].negsCounter === EMPTY && !gBoard[i][j].isMine) {
            //     fullExepand(i, j, mat)
            // }
        }
    }
}
// function unreveal(cellI, cellJ, mat) {
//     // var negsCount = 0
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             var curCelloc = { i: i, j: j }

//             if (j < 0 || j >= mat[i].length) continue

//             renderHintedCell(curCelloc, mat[i][j].negsCounter)
//             gIsHint=false
//             setTimeout(renderHintedCell(curCelloc, mat[i][j].negsCounter),1000)
//             // gBoard[i][j].isShown = false
//             // if (gBoard[i][j].negsCounter === EMPTY && !gBoard[i][j].isMine) {
//             //     fullExepand(i, j, mat)
//             // }
//         }
//     }
// }
function fullExepandv2(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var curCelloc = { i: i, j: j }

            if (j < 0 || j >= mat[i].length) continue

            renderCell(curCelloc, mat[i][j].negsCounter)
            gBoard[i][j].isShown = true
            if (gBoard[i][j].negsCounter === EMPTY && !gBoard[i][j].isMine) {
                fullExepandv3(i, j, mat)
            }
        }
    }
}

function revealNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var curCelloc = { i: i, j: j }

            if (j < 0 || j >= mat[i].length) continue

            renderCell(curCelloc, mat[i][j].negsCounter)
            gBoard[i][j].isShown = true
            if (gBoard[i][j].negsCounter === EMPTY && !gBoard[i][j].isMine) {
                fullExepand(i, j, mat)
            }
        }
    }

}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    if (value === 'safe') {
        elCell.classList.toggle("safe")
        return
    }
    elCell.classList.remove("closed")
    elCell.innerHTML = value

}

// function renderHintedCell(location,value){
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     if (gIsHint) {
//         // elCell.classList.remove("closed")
//         // elCell.innerHTML = value
//         elCell.classList.remove("closed")
//         elCell.innerHTML = value
//     }
//     else if(!gIsHint){
//         elCell.classList.add("closed")
//         elCell.innerText = EMPTY

//     }
// }


// function unReveal(cellI, cellJ, mat) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             // if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= mat[i].length) continue
//             if (mat[i][j].isShown === true) continue
//             var location = { i: i, j: j }
//             const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//             renderHintedCell(curCelloc, mat[i][j].negsCounter)
//             gIsHint=false
//             setTimeout(renderHintedCell(curCelloc, mat[i][j].negsCounter),1000)

//         }
//     }

// }


function hintUsed(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isShown === true) continue
            var location = { i: i, j: j }
            const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
            elCell.innerHTML = mat[i][j].negsCounter
            elCell.classList.toggle("closed")




        }
    }
    console.log(gIsHint)
    gIsHint = false
}


function OnDarkMode(el) {
    // var elSpan = document.querySelector(".darkBtn span")
    // if (elSpan.innertext === "🌛"){
    //     elSpan.innertext = '🌞'
    // }
    // else{
    //     elSpan.innertext = '🌛'

    // } 

    var elBtn = document.querySelector("button")
    var elBtn1 = document.querySelector(".b1")
    var elBtn2 = document.querySelector(".b2")
    var elBtn3 = document.querySelector(".b3")
    var elHint = document.querySelector(".hint")
    var elModalWin = document.querySelector(".modalWin")
    var elModalLose = document.querySelector(".modalLose")
    var elBody = document.querySelector("body")
    var elh2 = document.querySelector("h2")
    var elh3 = document.querySelector("h3")
    elBtn.classList.toggle("dark")
    elModalWin.classList.toggle("dark")
    elModalLose.classList.toggle("dark")
    elBody.classList.toggle("dark")
    elBody.classList.toggle("backImg")

    elh2.classList.toggle("dark")
    elh3.classList.toggle("dark")
    elBtn1.classList.toggle("dark")
    elBtn2.classList.toggle("dark")
    elBtn3.classList.toggle("dark")
    elHint.classList.toggle("dark")

    // if (!gIsDarkOn){
    //     document.body.style.backgroundImage = "url('image.png')";
    //     gIsDarkOn = true

    // }
    // else if (gIsDarkOn){
    //     document.body.style.backgroundImage = "url('./img/shrek10.jpg')";
    //     gIsDarkOn = false

    // }





}


function onMegaHintClick(elbtn) {

    // elbtn.style.backgroundColor = 'yellow'
    isMegaHint = true


}

function MegaHintActive(cellI1, cellJ1, cellI2, cellJ2, mat) {
    if (megaHintCounter === 2) return
    for (var i = cellI1; i <= cellI2; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ1; j <= cellJ2; j++) {

            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isShown === true) continue
            var location = { i: i, j: j }
            const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
            elCell.innerHTML = mat[i][j].negsCounter
            elCell.classList.toggle("closed")




        }
    }
    console.log(gIsHint)
    gIsHint = false
    megaHintCounter++
}

// function bestScore() {
//     var best = {
//         score: 
//     }
// }


