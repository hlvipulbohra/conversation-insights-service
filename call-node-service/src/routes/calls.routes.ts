import { Router } from 'express'
import {
    uploadCallAudio,
    getCallDetails,
    getCallAnalysisDetails,
} from '../controllers/calls.controller'
import { upload } from '../middlewares/multer.middleware'

const router = Router()

router.post('/', upload.single('audio'), uploadCallAudio)
router.get('/:id', getCallDetails)
router.get('/analysis/:id', getCallAnalysisDetails)

export default router
