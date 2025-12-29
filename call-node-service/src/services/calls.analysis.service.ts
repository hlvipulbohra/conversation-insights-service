import { CallAnalysis, CallProcessingResult } from '../types/api'
import { v4 as uuid } from 'uuid'
import {
    createCallAnalysisRecord,
    getCallAnalysisRecordByCallId,
} from '../models/calls.analysis.model'
import { logger } from '../utils/logger'

export const processCallAudio = async (
    calls_result: CallProcessingResult,
): Promise<void> => {
    try {
        if (!calls_result || !calls_result.callAnalytics) {
            logger.error('Invalid callAnalytics payload', {
                callId: calls_result?.callId,
            })
            return
        }

        const { duration_seconds, transcript, analysis } =
            calls_result.callAnalytics

        if (!calls_result.callId) {
            logger.error(
                `Missing callId in analysis payload ${JSON.stringify(calls_result)}`,
            )
            return
        }

        const callAnalysis: Partial<CallAnalysis> = {
            id: uuid(),
            durationSeconds: duration_seconds,
            callId: calls_result.callId,

            wasIssueResolved: analysis.was_issue_resolved ?? null,
            resolutionConfidence: analysis.resolution_confidence ?? null,
            overallExperience: analysis.overall_experience ?? null,
            customerComplaintSummary:
                analysis.customer_complaint_summary ?? null,
            churnRisk: analysis.churn_risk ?? null,
            predictedCsat: analysis.predicted_csat ?? null,
            npsPrediction: analysis.nps_prediction ?? null,
            qualityScoreAgent: analysis.quality_score_agent ?? null,
            escalationNeeded: analysis.escalation_needed ?? null,

            audioTranscript: {
                transcript: transcript ?? [],
            },

            insights: {
                customer_complaints: analysis.customer_complaints ?? [],
                agent_failures: analysis.agent_failures ?? [],
                agent_successes: analysis.agent_successes ?? [],
                root_cause: analysis.root_cause ?? null,
                customer_emotion_timeline:
                    analysis.customer_emotion_timeline ?? [],
                policy_or_process_gap: analysis.policy_or_process_gap ?? null,
                handling_metrics: analysis.handling_metrics ?? null,
            },
        }

        await createCallAnalysisRecord(callAnalysis)

        logger.info(
            'Call analysis stored successfully',
            JSON.stringify({ callId: calls_result.callId }),
        )
    } catch (error: any) {
        logger.error(
            'Failed to store call analysis',
            JSON.stringify({
                callId: calls_result?.callId,
                error: error?.message,
            }),
        )
        throw error
    }
}

export const getCallAnalysisByCallRecordId = async (
    id: string,
): Promise<Partial<CallAnalysis> | null> => {
    try {
        const result = await getCallAnalysisRecordByCallId(id)

        logger.info(`Fetched call analysis by call id ${id}`)

        return result
    } catch (error: any) {
        logger.error(
            'Failed to fetch call analysis',
            JSON.stringify({ id, error: error?.message }),
        )
        throw error
    }
}
