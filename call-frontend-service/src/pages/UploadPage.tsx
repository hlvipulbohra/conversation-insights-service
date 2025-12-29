import { useState } from 'react'
import { api } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleUpload() {
        if (!file) return

        if (file.size > 40 * 1024 * 1024) {
            alert('File size exceeds 40MB limit')
            return
        }

        if (!file.type.startsWith('audio/')) {
            alert('Please upload a valid audio file')
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        try {
            setLoading(true)

            const res = await api.post('/calls/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const callId = res.data?.call_id
            if (!callId) throw new Error('No call_id returned')

            navigate(`/calls/${callId}`)
        } catch {
            alert('Upload failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Upload Audio File</h2>

                <p style={styles.subtitle}>Supports .mp3, .wav up to 30MB</p>

                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={styles.input}
                />

                <button
                    disabled={!file || loading}
                    onClick={handleUpload}
                    style={{
                        ...styles.button,
                        ...(loading || !file ? styles.buttonDisabled : {}),
                    }}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#67E8F9',
        borderRadius: 14,
    },
    card: {
        width: 400,
        padding: 28,
        borderRadius: 14,
        background: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    },
    title: {
        marginBottom: 10,
    },
    subtitle: {
        marginBottom: 20,
        color: '#666',
        fontSize: 14,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        width: '100%',
        padding: '10px 0',
        borderRadius: 8,
        border: 'none',
        fontSize: 16,
        cursor: 'pointer',
        background: '#67E8F9',
        color: 'white',
    },
    buttonDisabled: {
        background: '#ECFEFF',
        cursor: 'not-allowed',
        color: '#aa9999',
    },
}
