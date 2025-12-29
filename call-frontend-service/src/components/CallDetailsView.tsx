import React from 'react'

type BadgeProps = {
    label: string
    value: string | number
    color?: string
}

const Badge: React.FC<BadgeProps> = ({ label, value, color = '#2563EB' }) => (
    <span
        style={{
            padding: '8px 12px',
            borderRadius: '999px',
            background: color,
            color: 'white',
            fontSize: '13px',
            marginRight: 8,
            fontWeight: 600,
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        }}
    >
        {label}: {value}
    </span>
)
// TODO - any

type CallDetailsProps = {
    data: {
        callAnalysisDetails?: any
    }
}

const msToTime = (timestr: number) => {
    let ms = parseTimestampToMs(timestr)
    if (ms < 0) return timestr
    const totalSeconds = Math.floor(ms / 1000)
    const seconds = totalSeconds % 60
    const totalMinutes = Math.floor(totalSeconds / 60)
    const minutes = totalMinutes % 60
    const hours = Math.floor(totalMinutes / 60)

    return (
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`
    )
}

const parseTimestampToMs = (value: string | number): number => {
    // if time is in milliseconds
    if (typeof value === 'number') return value

    // Trim
    const ts = value.trim()

    // pure number string
    if (/^\d+$/.test(ts)) return parseInt(ts, 10)

    // to parse formats like 0:04.720 OR 01:02:03.450
    const parts = ts.split(':')
    let hours = 0,
        minutes = 0,
        seconds = 0,
        millis = 0

    if (parts.length === 2) {
        // M:SS.mmm
        minutes = parseInt(parts[0], 10)
        const [sec, ms = '0'] = parts[1].split('.')
        seconds = parseInt(sec, 10)
        millis = parseInt(ms.padEnd(3, '0'), 10)
    } else if (parts.length === 3) {
        // H:MM:SS.mmm
        hours = parseInt(parts[0], 10)
        minutes = parseInt(parts[1], 10)
        const [sec, ms = '0'] = parts[2].split('.')
        seconds = parseInt(sec, 10)
        millis = parseInt(ms.padEnd(3, '0'), 10)
    } else {
        console.log('Unsupported timestamp format: ' + value)
        return 0
    }

    return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis
}

export default function CallDetailsView({ data }: CallDetailsProps) {
    const d = data?.callAnalysisDetails
    if (!d) return <h3>No data found</h3>

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.heroCard}>
                <div>
                    <h2 style={styles.heroTitle}>📞 Call Analysis Report</h2>
                    <p style={styles.heroSub}>Call ID: {d.callId}</p>
                </div>

                <div style={styles.badgeRow}>
                    <Badge
                        label="Duration"
                        value={`${msToTime(d.durationSeconds * 1000)}`}
                    />
                    <Badge
                        label="Resolved"
                        value={d.wasIssueResolved ? 'Yes' : 'No'}
                        color={d.wasIssueResolved ? '#16A34A' : '#DC2626'}
                    />
                    <Badge
                        label="Churn Risk"
                        value={d.churnRisk}
                        color="#EF4444"
                    />
                    <Badge label="CSAT" value={d.predictedCsat} />
                    <Badge label="NPS" value={d.npsPrediction} />
                    <Badge
                        label="Agent Score"
                        value={d.qualityScoreAgent}
                        color="#7C3AED"
                    />
                </div>
            </div>

            {/* GRID SECTION */}
            <div style={styles.grid}>
                <div style={styles.sectionCard}>
                    <h3 style={styles.sectionTitle}>Complaint Summary</h3>
                    <p>{d.customerComplaintSummary}</p>
                </div>

                <div style={styles.sectionCard}>
                    <h3 style={styles.sectionTitle}>Overall Experience</h3>
                    <p>{d.overallExperience}</p>
                </div>
            </div>

            {/* CUSTOMER COMPLAINTS */}
            <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Customer Complaints</h3>
                {d?.insights?.customer_complaints?.map(
                    (c: any, idx: number) => (
                        <div key={idx} style={styles.listBox}>
                            <div style={styles.badge}>{c.category}</div>
                            <small>Severity {c.severity}</small>
                            <p>{c.description}</p>
                        </div>
                    ),
                )}
                {d?.insights?.customer_complaints?.length === 0 && (
                    <p>No customer complaints detected.</p>
                )}
            </div>

            {/* AGENT SUCCESSES */}
            <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Agent Success Moments</h3>
                {d?.insights?.agent_successes?.map((s: any, idx: number) => (
                    <div key={idx} style={styles.successBox}>
                        <b>⏱ {msToTime(s.timestamp)}</b>
                        <i style={{ display: 'block', marginTop: 6 }}>
                            "{s.utterance}"
                        </i>
                        <p>{s.description}</p>
                    </div>
                ))}
            </div>

            {/* EMOTION TIMELINE */}
            <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Customer Emotion Timeline</h3>
                <div style={styles.timelineRow}>
                    {d?.insights?.customer_emotion_timeline?.map(
                        (e: any, idx: number) => (
                            <Badge
                                key={idx}
                                label={e.emotion?.toUpperCase()}
                                value={msToTime(e.timestamp)}
                                color={
                                    e.emotion?.toUpperCase() === 'NEGATIVE'
                                        ? '#DC2626'
                                        : e.emotion?.toUpperCase() ===
                                            'POSITIVE'
                                          ? '#16A34A'
                                          : '#6B7280'
                                }
                            />
                        ),
                    )}
                </div>
            </div>

            {/* RAW JSON */}
            {/* <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Raw JSON</h3>
                <pre style={styles.json}>{JSON.stringify(data, null, 2)}</pre>
            </div> */}
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: 980,
        margin: '40px auto',
        padding: 20,
        fontFamily: 'system-ui, Segoe UI, Roboto',
        borderRadius: 14,
        border: '1px solid #E5E7EB',
    },

    heroCard: {
        background: '#5ac5f5',
        padding: 28,
        borderRadius: 14,
        marginBottom: 24,
        color: 'white',
        boxShadow: '0 20px 40px rgba(2,132,199,0.35)',
    },

    heroTitle: {
        margin: 0,
        fontSize: 26,
        fontWeight: 800,
    },

    heroSub: {
        marginTop: 6,
        opacity: 0.9,
    },

    badgeRow: {
        marginTop: 18,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        textTransform: 'capitalize',
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 20,
    },

    sectionCard: {
        background: '#bee8fb',
        padding: 20,
        borderRadius: 14,
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        marginBottom: 20,
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: 10,
    },

    listBox: {
        background: '#F9FAFB',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        border: '1px solid #E5E7EB',
    },

    badge: {
        display: 'inline-block',
        background: '#EEF2FF',
        color: '#4F46E5',
        padding: '2px 8px',
        borderRadius: 999,
        marginBottom: 6,
        fontWeight: 600,
        fontSize: 12,
    },

    successBox: {
        background: '#ECFEFF',
        padding: 14,
        borderRadius: 10,
        border: '1px solid #67E8F9',
        marginBottom: 10,
    },

    timelineRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
    },

    json: {
        background: '#020617',
        color: '#A5F3FC',
        padding: 18,
        borderRadius: 10,
        overflowX: 'auto',
    },
}
