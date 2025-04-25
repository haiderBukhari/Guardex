import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ShieldCheck, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Verify = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`https://guardex-node-js.vercel.app/api/auth/verify/${id}`)
        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          toast({
            title: '✅ Email Verified',
            description: 'You can now log in to your account.',
          })
          setTimeout(() => navigate('/login'), 2000)
        } else {
          setStatus('error')
          toast({
            title: 'Verification Failed',
            description: data.error || 'Invalid or expired link.',
            variant: 'destructive',
          })
        }
      } catch (err) {
        setStatus('error')
        toast({
          title: 'Server Error',
          description: 'Could not verify at this time.',
          variant: 'destructive',
        })
      }
    }

    if (id) verifyUser()
  }, [id, navigate, toast])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-4 glass-effect p-10 glow-sm rounded-lg max-w-md w-full">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto animate-spin text-guardex-500" size={48} />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <ShieldCheck className="mx-auto text-green-500" size={48} />
            <h2 className="text-xl font-semibold">Email Verified!</h2>
            <p className="text-muted-foreground text-sm">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto text-red-500" size={48} />
            <h2 className="text-xl font-semibold">Verification Failed</h2>
            <p className="text-muted-foreground text-sm">This link may have expired or is invalid.</p>
            <Button onClick={() => navigate('/')} className="mt-4">Go to Home</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Verify