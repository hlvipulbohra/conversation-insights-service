export type CallStatus = 'processing' | 'completed' | 'failed'
export type ChurnRiskType = 'high' | 'medium' | 'low'

export interface CallRecord {
    readonly id: string
    audioUrl: string
    status: CallStatus
    readonly createdAt: Date
    updatedAt: Date
}
export interface CallAnalysis {
    readonly id: string
    readonly callId: string
    readonly durationSeconds: number

    wasIssueResolved: boolean | null
    resolutionConfidence: number | null // 0-100
    overallExperience: string | null
    customerComplaintSummary: string | null
    churnRisk: ChurnRiskType
    predictedCsat: number | null // 0-5
    npsPrediction: number | null // -100 to 100
    qualityScoreAgent: number | null // 0-100
    escalationNeeded: boolean | null

    insights: object
    audioTranscript: object

    readonly createdAt: Date
    updatedAt: Date
}

export interface CallProcessingResult {
    readonly callId: string
    callAnalytics: any
}
