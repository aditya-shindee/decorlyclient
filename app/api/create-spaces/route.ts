import { supabase } from "@/lib/supabase";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, roomType, roomImageUrl, theme, colorPalette, additionalInstructions } = body;

    // Create new space
    const { data: space, error: spaceError } = await supabase
      .from('spaces')
      .insert({
        user_id: userId,
        room_type: roomType,
        room_image_url: roomImageUrl,
        theme,
        color_palette: colorPalette,
        additional_instructions: additionalInstructions,
        status: 'pending'
      })
      .select()
      .single();

    if (spaceError) {
      return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
    }

    return NextResponse.json({ 
      space,
      hasCredits: true
    });

  } catch (error) {
    console.error('Error in space creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 