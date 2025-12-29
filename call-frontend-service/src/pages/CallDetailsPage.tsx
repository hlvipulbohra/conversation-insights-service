import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import CallDetailsView from '../components/CallDetailsView'

async function fetchDetails(callId: string) {
    const res = await api.get(`/calls/analysis/${callId}/`)
    return res.data
}

export default function CallDetailsPage() {
    const { id } = useParams()

    const { data, isLoading } = useQuery({
        queryKey: ['call-details', id],
        queryFn: () => fetchDetails(id!),
    })

    if (isLoading) return <p>Loading…</p>
    return <CallDetailsView data={data} />
}
