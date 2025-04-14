import multer from "multer";
import path from "path";


const FILE_TYPE = {
    'image/png' : "png",
    'image/jpeg' : "jpeg",
    'image/jpg' : "jpg",
}

const storage = multer.diskStorage({
    // cb = callback
    destination: function (req, file, cb) {

        // validasi dari format filenya
        const isValidFormat = FILE_TYPE[file.mimetype]
        // buat ngegabungin kata kata yang di FILE_TYPE pake object dan join
        const textValid = Object.values(FILE_TYPE).join('/');
        let uploadError = new Error(`Invalid Format, only valid ${textValid}`)

        if (isValidFormat) {
            uploadError = null
        }
     
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // buat kode acak untuk penamaan file baru
        const uniqueFile = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`

        cb(null, uniqueFile)
    }
})

const upload = multer({ storage: storage})

export default upload