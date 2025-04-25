import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

router.get('/', async (req, res) => {
    const { user_id } = req.query

    if (!user_id) return res.status(400).json({ error: 'Missing user_id in request body' })

    try {
        const { data, error } = await supabase
            .from('website_scans')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: error.message })

        return res.status(200).json({ scans: data })
    } catch (err) {
        console.error('Error fetching user scans:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})


export default router