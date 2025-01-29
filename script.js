const canvas = document.querySelector('canvas')
const colorInput = document.getElementById('color-value')
const ctx = canvas.getContext('2d')

const sizeInput = document.querySelector('.size-input')
const sizeInputCoords = sizeInput.getBoundingClientRect()
const sizeCircle = document.querySelector('.size-circle')

let canvasActive = false
let sizeActive = false
let pathList = []
let path = []
let size = 10


canvas.width = window.innerWidth
canvas.height = window.innerHeight


// FOR MOUSE

canvas.addEventListener('mousedown', () => {
    presetBarClose()
    canvasActive = true
    ctx.beginPath()
})

canvas.addEventListener('mouseup', () => {
    pathList.push(path)
    path = []

    ctx.beginPath()
})

canvas.addEventListener('mousemove', (e) => {
    if (canvasActive) {
        e.preventDefault()

        path.push({
            clientX: e.clientX,
            clientY: e.clientY,
            color: colorInput.value,
            size: size
        })

        drawPath(e, colorInput.value, size)
    }
})




// FOR TOUCH

canvas.addEventListener('touchstart', (e) => {
    presetBarClose()
    e.preventDefault()
})


canvas.addEventListener('touchend', (e) => {
    e.preventDefault()

    pathList.push(path)
    path = []

    ctx.beginPath()
    sizeCircle.style.scale = 1
})

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault()

    pathList.push(path)
    path = []

    ctx.beginPath()

    sizeCircle.style.scale = 1
})

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault()

    path.push({
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
        color: colorInput.value,
        size: size
    })

    drawPath(e.changedTouches[0], colorInput.value, size)
})



// DRAW FUNCTION

function drawPath(dot, color, size) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = size * 2

    ctx.lineTo(dot.clientX, dot.clientY)
    ctx.stroke()

    ctx.beginPath()

    if(size > 2) {
        ctx.arc(dot.clientX, dot.clientY, size, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx.beginPath()
    ctx.moveTo(dot.clientX, dot.clientY)
}




// UNDO

function undoAction() {
    clearCanvas()

    pathList.splice(pathList.length - 1, 1)

    for (let i = 0; i < pathList.length; i++) {
        let el = pathList[i]
        ctx.beginPath()

        console.log(pathList);

        for (let i = 0; i < el.length; i++) {
            drawPath(el[i], el[i].color, el[i].size)
        }
    }

    ctx.beginPath()
}


// SIZE 

sizeInput.addEventListener('mousedown', (e) => {
    sizeActive = true
    changeSize(e)
})

document.addEventListener('mouseup', () => {
    canvasActive = false
    sizeActive = false

    sizeCircle.style.scale = 1
})

document.addEventListener('mousemove', (e) => {
    if (!sizeActive) {
        return
    }
    changeSize(e)
})

sizeInput.addEventListener('touchstart', (e) => {
    changeSize(e.changedTouches[0])
})

sizeInput.addEventListener('touchmove', (e) => {
    changeSize(e.changedTouches[0])
})

function changeSize(e) {
    let position = e.clientX - sizeInputCoords.x

    if (position > 0 && position < 160) {
        sizeCircle.style.left = `${position - 12}px`
        sizeCircle.style.scale = 0.5 + position / 100

        size = Math.max(1, (position - 10) / 2)
    }
}


// FEATURES



function clearCanvas() {
    presetBarClose()
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.fillStyle = colorInput.value
}


function setColorPreset(hex) {
    colorInput.value = hex
    colorLabel()
}

function presetBarClose() {
    let bar = document.querySelector('.bar-preset')

    if (bar.classList.contains('bar-preset-active')) {
        bar.classList.remove('bar-preset-active')
    }
}

function presetBarSwitch() {
    let bar = document.querySelector('.bar-preset')

    if (!bar.classList.contains('bar-preset-active')) {
        bar.classList.add('bar-preset-active')
    } else {
        bar.classList.remove('bar-preset-active')
    }
}

document.querySelector('.bar-preset').addEventListener('click', presetBarClose)

function colorLabel() {
    document.querySelector('.color-preview').style.background = colorInput.value
}

colorInput.addEventListener('change', () => {
    colorLabel()
    presetBarClose()
})
colorLabel()




document.addEventListener('keydown', (e) => {
    if (e.getModifierState('Meta') && e.key == 'z') {
        undoAction()
    }
})
