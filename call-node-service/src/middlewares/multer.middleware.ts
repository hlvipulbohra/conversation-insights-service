import multer from 'multer'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export const storage = multer.diskStorage({
    // as of now files are stored in 'uploads' folder later we can change it to cloud storage
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR)
    },
    // changing file name to avoid conflicts or overwrites
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    },
})

export const upload = multer({
    storage,
    limits: {
        fileSize: 40 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('audio/')) {
            return cb(new Error('Only audio files allowed'))
        }
        cb(null, true)
    },
})
