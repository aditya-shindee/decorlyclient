// hooks/useRealtimecreditData.ts
import { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from '@supabase/supabase-js'

interface creditData {
  amount: number
}

export function useRealtimeCreditData(userId: string | null) {
  const [creditData, setCreditData] = useState<creditData>({ 
    amount: 0, 
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    let subscription: RealtimeChannel

    const setupRealtime = async () => {
      try {
        // Get initial data
        const { data: initialData, error } = await supabase
          .from('credits')
          .select('amount')
          .eq('user_id', userId)
          .single()

        if (error) throw error

        setCreditData(initialData)
        setIsLoading(false)

        // Subscribe to changes
        subscription = supabase
          .channel(`user-updates-${userId}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'credits',
            filter: `user_id=eq.${userId}`
          }, (payload) => {
            console.log('Realtime update:', payload)
            setCreditData({
              amount: payload.new.amount,
            })
          })
          .subscribe()

      } catch (error) {
        console.error('Error setting up realtime:', error)
        setIsLoading(false)
      }
    }

    setupRealtime()

    // Cleanup subscription
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [userId, supabase])

  return { creditData, isLoading }
}