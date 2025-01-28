const canvas = document.querySelector('canvas')
const colorInput = document.getElementById('color-value')
const sizeInput = document.getElementById('size-value')
const ctx = canvas.getContext('2d')
let isMouseDown = false
let pathList = []
let path = []


canvas.width = window.innerWidth
canvas.height = window.innerHeight


// FOR MOUSE

canvas.addEventListener('mousedown', () => {
    presetBarClose()
    isMouseDown = true
})

canvas.addEventListener('mouseup', () => {
    isMouseDown = false

    pathList.push(path)
    path = []

    ctx.beginPath()
})

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        e.preventDefault()

        path.push({
            clientX: e.clientX,
            clientY: e.clientY,
            color: colorInput.value,
            size: sizeInput.value
        })

        drawPath(e, colorInput.value, sizeInput.value)
    }
})




// FOR TOUCH

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault()
})


canvas.addEventListener('touchend', (e) => {
    e.preventDefault()

    pathList.push(path)
    path = []

    ctx.beginPath()
})

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault()

    pathList.push(path)
    path = []

    ctx.beginPath()
})

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault()

    path.push({
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
        color: colorInput.value,
        size: sizeInput.value
    })

    drawPath(e.changedTouches[0], colorInput.value, sizeInput.value)
})



// DRAW FUNCTION

function drawPath(dot, color, size) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = size * 2

    ctx.lineTo(dot.clientX, dot.clientY)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(dot.clientX, dot.clientY, size, 0, Math.PI * 2)
    ctx.fill()

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

        for (let i = 0; i < el.length; i++) {
            drawPath(el[i], el[i].color, el[i].size)
        }
    }

    ctx.beginPath()
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

    if(bar.classList.contains('bar-preset-active')){
        bar.classList.remove('bar-preset-active')
    }
}

function presetBarSwitch() {
    let bar = document.querySelector('.bar-preset')

    if(!bar.classList.contains('bar-preset-active')){
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
