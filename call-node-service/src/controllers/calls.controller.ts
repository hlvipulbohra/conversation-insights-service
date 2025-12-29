import path from 'path'
import { Request, Response } from 'express'
import { processCallAudio, getCallById } from '../services/calls.service'
import { getCallAnalysisByCallRecordId } from '../services/calls.analysis.service'
import { logger } from '../utils/logger'

export const uploadCallAudio = async (req: Request, res: Response) => {
    try {
        const file = req.file
        //  check if file is present
        if (!file) {
            return res.status(400).json({ message: 'Audio file is required' })
        }
        // check if file type is audio
        if (!file.mimetype.startsWith('audio/')) {
            return res.status(400).json({ message: 'Only audio files allowed' })
        }

        const call = await processCallAudio(file.path)

        const filename = path.basename(file.path)
        logger.info('Call audio received', filename)

        return res.status(202).json({
            status: call.status,
            call_id: call.id,
            message: 'Processing started',
        })
    } catch (err: any) {
        console.error({
            msg: 'Upload failed',
            error: err?.message || err,
        })

        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}

export const getCallDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ message: 'Call ID required' })

        const callDetails = await getCallById(id)
        if (!callDetails)
            return res.status(404).json({ message: 'Call not found' })

        return res.status(200).json({ callDetails })
    } catch (err: any) {
        logger.error('getCallDetails failed', err?.message || err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getCallAnalysisDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ message: 'Call ID required' })

        const callAnalysisDetails = await getCallAnalysisByCallRecordId(id)
        if (!callAnalysisDetails)
            return res.status(404).json({ message: 'Analysis not found' })

        return res.status(200).json({ callAnalysisDetails })
    } catch (err: any) {
        console.error({
            msg: 'getCallAnalysisDetails failed',
            error: err?.message || err,
        })
        return res.status(500).json({ message: 'Internal server error' })
    }
}
