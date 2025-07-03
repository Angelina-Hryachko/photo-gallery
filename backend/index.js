const express = require('express')
const multer = require('multer')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer( {storage} )

app.use(express.static(path.join(__dirname, '../frontend')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.post('/upload', upload.array('photos', 10), (req, res) => {
    const files = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        originalName: file.originalname,
        size: file.size
    }))
    res.json( {files} )
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))