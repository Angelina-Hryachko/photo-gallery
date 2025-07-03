const step1 = document.getElementById('step1')
const step2 = document.getElementById('step2')
const galleryContainer = document.getElementById('galleryContainer')

const photoCountInput = document.getElementById('photoCount')
const startUploadBtn = document.getElementById('startUploadBtn')

const fileInputsContainer = document.getElementById('fileInputs')
const uploadForm = document.getElementById('uploadForm')

const gallery = document.getElementById('gallery')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')

const modal = $.modal

let photoCount = 3
let photos = []
let currentIndex = 0
let infoShownIndexes = new Set()

startUploadBtn.addEventListener('click', () => {
    let val = Number(photoCountInput.value)
    if (val < 3 || val > 10 || isNaN(val)) {
        modal({
            title: 'Enter a number from 3 to 10',
            buttonColor: '#cc3300'
        })
        return
    }
    photoCount = val
    prepareFileInput(photoCount)
    step1.style.display = 'none'
    step2.style.display = 'block'
})

function prepareFileInput(count) {
    fileInputsContainer.innerHTML = ``
    for (let i = 0; i < count; i++) {
        const label = document.createElement('label')
        label.textContent = `Photo ${i + 1}: `
        const input = document.createElement('input')
        input.type = 'file'
        input.name = 'photos'
        input.accept = 'image/*'
        input.required = true
        label.appendChild(input)
        label.appendChild(document.createElement('br'))
        fileInputsContainer.appendChild(label)
    }
}

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(uploadForm)

    const res = await fetch('/upload', {
        method: 'POST',
        body: formData
    })

    if (!res.ok) {
        modal({
            title: 'Error loading files',
            buttonColor: '#cc3300'
        })
        return
    }

    const data = await res.json();
        photos = data.files.map(file => ({
        url: file.url,
        description: file.originalName,
        size: null
    }))

      for (let i = 0; i < photos.length; i++) {
        try {
            const resp = await fetch(photos[i].url)
            const blob = await resp.blob()
        photos[i].size = formatBytes(blob.size)
        } catch(e) {
            photos[i].size = `Unknown`
        }
    }

        step2.style.display = `none`
        galleryContainer.style.display = `block`
        currentIndex = 0
        infoShownIndexes.clear()
        renderPhotos()    
})

function renderPhotos() {
    gallery.innerHTML = ``

    const visibleIndexes = []
    for (let i = 0; i < 3; i++) {
        visibleIndexes.push((currentIndex + i) % photos.length)
    }

    infoShownIndexes.forEach(index => {
        if (!visibleIndexes.includes(index)) {
            infoShownIndexes.delete(index)
        }
    })

    for (let i = 0; i < 3; i++) {
        const photoIndex = (currentIndex + i) % photos.length
        const photo = photos[photoIndex]

        const container = document.createElement('div')
        container.className = 'photo-frame'
        container.dataset.index = photoIndex

        if (infoShownIndexes.has(photoIndex)) {
            container.appendChild(createInfoDiv(photoIndex))
        } else {
            container.appendChild(createImage(photoIndex))
        }

        gallery.appendChild(container)
    }
}

function createInfoDiv(index) {
    const photo = photos[index]
    const infoDiv = document.createElement('div')
    infoDiv.className = 'info'
    infoDiv.innerHTML = `
        <h3>Info</h3>
        <p>Name: ${photo.description}</p>
        <p>Size: ${photo.size}</p>
        <p style="color: #555;">Click to return</p>
    `
    infoDiv.onclick = () => {
        showImage(index)
    }
    return infoDiv
}

function createImage(index) {
    const photo = photos[index]
    const img = document.createElement('img');
    img.src = photo.url
    img.alt = `Photo ${index + 1}`
    img.onclick = () => {
        showInfo(index)
    }
    return img
}

function showInfo(index) {
    const container = gallery.querySelector(`.photo-frame[data-index='${index}']`)
    if (container) {
        container.innerHTML = ''
        const info = createInfoDiv(index)
        applyFadeTransition(container, info)
        infoShownIndexes.add(index)
    }
}

function showImage(index) {
    const container = gallery.querySelector(`.photo-frame[data-index='${index}']`)
    if (container) {
        container.innerHTML = ''
        const img = createImage(index)
        applyFadeTransition(container, img)
        infoShownIndexes.delete(index)
    }
}

function applyFadeTransition(container, element) {
    element.classList.add('fade-enter')
    container.appendChild(element)

    requestAnimationFrame(() => {
        element.classList.add('fade-enter-active')
        element.classList.remove('fade-enter')
    })
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length
    renderPhotos()
})

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % photos.length
    renderPhotos()
})

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

document.addEventListener('DOMContentLoaded', () => {
    
})