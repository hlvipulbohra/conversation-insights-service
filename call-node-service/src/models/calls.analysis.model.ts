import { pool } from '../config/db'
import { logger } from '../utils/logger'
import { CallAnalysis } from '../types/api'

export const createCallAnalysisRecord = async (
    callAnalysis: Partial<CallAnalysis>,
): Promise<void> => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        await client.query(
            `
      INSERT INTO calls_insights (
        id, duration_seconds, call_id, was_issue_resolved,
        resolution_confidence, overall_experience,
        customer_complaint_summary, churn_risk, predicted_csat,
        nps_prediction, quality_score_agent, escalation_needed,
        audio_transcript, insights, created_at, updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,NOW(),NOW()
      )
      `,
            [
                callAnalysis.id,
                callAnalysis.durationSeconds,
                callAnalysis.callId,
                callAnalysis.wasIssueResolved,
                callAnalysis.resolutionConfidence,
                callAnalysis.overallExperience,
                callAnalysis.customerComplaintSummary,
                callAnalysis.churnRisk,
                callAnalysis.predictedCsat,
                callAnalysis.npsPrediction,
                callAnalysis.qualityScoreAgent,
                callAnalysis.escalationNeeded,
                callAnalysis.audioTranscript,
                callAnalysis.insights,
            ],
        )

        await client.query(
            `UPDATE calls SET status='completed', updated_at=NOW() WHERE id=$1`,
            [callAnalysis.callId],
        )

        await client.query('COMMIT')
        logger.info(
            `Call analysis record created for callId: ${callAnalysis.callId}`,
        )
    } catch (err: any) {
        await client.query('ROLLBACK')
        logger.error(
            `Error creating call analysis record for callId: ${callAnalysis.callId}, Error: ${err.message}`,
        )
        throw err
    } finally {
        client.release()
    }
}

export const getCallAnalysisRecordByCallId = async (
    callId: string,
): Promise<Partial<CallAnalysis> | null> => {
    const result = await pool.query(
        `SELECT * FROM calls_insights WHERE call_id = $1`,
        [callId],
    )

    if (!result.rows.length) return null

    const row = result.rows[0]

    return {
        id: row.id,
        durationSeconds: row.duration_seconds,
        callId: row.call_id,
        customerComplaintSummary: row.customer_complaint_summary,
        wasIssueResolved: row.was_issue_resolved,
        resolutionConfidence: row.resolution_confidence,
        overallExperience: row.overall_experience,
        churnRisk: row.churn_risk,
        predictedCsat: row.predicted_csat,
        npsPrediction: row.nps_prediction,
        qualityScoreAgent: row.quality_score_agent,
        escalationNeeded: row.escalation_needed,
        insights: row.insights,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}
