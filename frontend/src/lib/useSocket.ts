import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:5000") // Adjust if hosted elsewhere

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  return socketRef
}
