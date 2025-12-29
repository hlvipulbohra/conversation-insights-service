import { pool } from '../config/db'
import { logger } from '../utils/logger'
import { CallRecord } from '../types/api'

const mapRow = (row: any): CallRecord => ({
    id: row.id,
    audioUrl: row.audio_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
})

export const createCallRecord = async (call: CallRecord): Promise<void> => {
    if (!call?.id) throw new Error('Call ID is required')

    const query = `
    INSERT INTO calls (id, audio_url, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5)
  `
    try {
        await pool.query(query, [
            call.id,
            call.audioUrl,
            call.status,
            call.createdAt,
            call.updatedAt,
        ])
        logger.info(`Call created:`, call.id)
    } catch (err: any) {
        logger.error(
            `DB error: createCallRecord failed: ${err.message}, callId: ${call.id}`,
        )
        throw err
    }
}

export const getCallRecordById = async (
    id: string,
): Promise<CallRecord | null> => {
    const result = await pool.query(`SELECT * FROM calls WHERE id = $1`, [id])
    if (!result.rows.length) return null
    return mapRow(result.rows[0])
}

export const updateCallStatus = async (
    id: string,
    status: string,
): Promise<void> => {
    try {
        await pool.query(
            `UPDATE calls SET status=$1, updated_at=NOW() WHERE id=$2`,
            [status, id],
        )
        logger.info(`Call status updated: ${id}, status: ${status}`)
    } catch (err: any) {
        logger.error(`Error updating call status for ${id}: ${err.message}`)
        throw err
    }
}

export const updateCallUrl = async (id: string, url: string): Promise<void> => {
    try {
        await pool.query(
            `UPDATE calls SET audio_url=$1, updated_at=NOW() WHERE id=$2`,
            [url, id],
        )
        logger.info(`Call URL updated: ${id}, url: ${url}`)
    } catch (err: any) {
        logger.error(`DB error: updateCallUrl failed for ${id}: ${err.message}`)
        throw err
    }
}
