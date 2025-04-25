import express from 'express'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'

config()

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_HOST,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
})

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing required fields' })

  const { data: existingUser, error: checkError } = await supabase.from('users').select('id').eq('email', email).single()
  if (existingUser) return res.status(409).json({ error: 'Email already registered' })

  const hashedPassword = await bcrypt.hash(password, 10)
  const verifyToken = uuidv4()

  const { data, error } = await supabase.from('users').insert([
    {
      name,
      email,
      password: hashedPassword,
      role,
      is_verified: false,
      verify_token: verifyToken,
    },
  ])

  if (error) return res.status(500).json({ error: error.message })

  const verifyLink = `${process.env.FRONTEND_URL}/verify/${verifyToken}`

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background-color: #22BC66; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Guardex Innovations</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <h2>Welcome ${name}!</h2>
        <p>Your account has been created successfully. Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verifyLink}" style="background-color: #22BC66; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Verify Email
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Cheers,<br>The Guardex Team</p>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_HOST,
      to: email,
      subject: 'Verify your email – Guardex',
      html: emailBody,
    })
    return res.status(200).json({ message: 'Signup successful. Verification email sent.' })
  } catch (err) {
    return res.status(500).json({ error: 'Signup succeeded but failed to send email.' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single()
  if (error || !user) return res.status(401).json({ error: 'Invalid credentials' })

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' })

  if (!user.is_verified) return res.status(403).json({ error: 'Email not verified' })

  res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

// GET /verify/:token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params

  const { data: user, error } = await supabase.from('users').select('*').eq('verify_token', token).single()
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' })

  const { error: updateError } = await supabase
    .from('users')
    .update({ is_verified: true, verify_token: null })
    .eq('id', user.id)

  if (updateError) return res.status(500).json({ error: 'Verification failed' })

  res.status(200).json({ message: 'Email successfully verified' })
})


export default router