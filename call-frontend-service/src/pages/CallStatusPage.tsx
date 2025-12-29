import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

async function fetchStatus(callId: string) {
    const res = await api.get(`/calls/${callId}`)
    return res.data?.callDetails
}

export default function CallStatusPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['call-status', id],
        queryFn: () => fetchStatus(id!),
        refetchInterval: 5000,
    })

    useEffect(() => {
        if (data?.status === 'completed') {
            navigate(`/calls/${id}/details`)
        }
    }, [data, id, navigate])

    if (isLoading)
        return (
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Checking Status…</h2>
                    <p style={styles.text}>Fetching call processing state</p>
                </div>
            </div>
        )

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.loader}></div>
                <h2 style={styles.title}>Processing Call</h2>

                <p style={styles.text}>
                    <strong>Status:</strong>{' '}
                    <span style={styles.status}>{data?.status}</span>
                </p>

                {isFetching && (
                    <small style={styles.note}>
                        The audio is being processed… refreshing every 5
                        seconds.
                    </small>
                )}
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#67E8F9',
        borderRadius: 14,
    },

    card: {
        background: 'rgba(255,255,255,0.95)',
        padding: '28px 30px',
        borderRadius: 16,
        width: 420,
        textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
    },

    title: {
        marginTop: 10,
        marginBottom: 6,
        fontWeight: 800,
        color: '#0f172a',
    },

    text: {
        color: '#475569',
    },

    status: {
        color: '#0284c7',
        fontWeight: 700,
    },

    note: {
        display: 'block',
        marginTop: 8,
        color: '#64748b',
    },
}
