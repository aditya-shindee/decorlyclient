import { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from '@supabase/supabase-js'

interface Space {
  id: string;
  room_type: string;
  theme: string;
  name: string;
  url: string;
}

export function useRealtimeSpaceData(userId: string | null) {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    let subscription: RealtimeChannel

    const setupRealtime = async () => {
      try {
        // Get initial data using the get-spaces API
        const response = await fetch(`/api/get-spaces?userId=${userId}`)
        const data = await response.json()
        
        if (data.error) throw new Error(data.error)

        setSpaces(data.spaces || [])
        setIsLoading(false)

        // Subscribe to changes in the spaces table
        subscription = supabase
          .channel(`spaces-updates-${userId}`)
          .on('postgres_changes', {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'spaces',
            filter: `user_id=eq.${userId}`
          }, (payload) => {
            console.log('Realtime spaces update:', payload)
            
            // Handle different types of changes
            if (payload.eventType === 'INSERT') {
              // New space added
              const newSpace = {
                id: payload.new.id,
                room_type: payload.new.room_type,
                theme: payload.new.theme,
                name: payload.new.room_type,
                url: `/studio/${payload.new.id}`
              }
              setSpaces(prev => [newSpace, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              // Space updated
              const updatedSpace = {
                id: payload.new.id,
                room_type: payload.new.room_type,
                theme: payload.new.theme,
                name: payload.new.room_type,
                url: `/studio/${payload.new.id}`
              }
              setSpaces(prev => prev.map(space => 
                space.id === updatedSpace.id ? updatedSpace : space
              ))
            } else if (payload.eventType === 'DELETE') {
              // Space deleted
              setSpaces(prev => prev.filter(space => space.id !== payload.old.id))
            }
          })
          .subscribe()

      } catch (error) {
        console.error('Error setting up realtime spaces:', error)
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
  }, [userId])

  return { spaces, isLoading }
}