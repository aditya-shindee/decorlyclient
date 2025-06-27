import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from 'next/server';
import { saveError } from '@/lib/log-error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Fetch spaces for the user using the provided userId
    const { data: rawSpaces, error: spacesError } = await supabase
      .from('spaces')
      .select('room_type, id, theme')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const spaces = rawSpaces?.map(({ room_type, id, ...rest }) => ({
      name: room_type,
      url: `/studio/${id}`,
      ...rest,
    }));

    if (spacesError) {
      console.error('Error fetching spaces:', spacesError);
      await saveError(
        'Spaces Fetch Error',
        '/api/get-credits',
        `Failed to fetch spaces for user ${userId}\n\n${JSON.stringify(spacesError)}`,
        request.nextUrl.href
      );
      return NextResponse.json(
        { error: 'Failed to fetch spaces' },
        { status: 500 }
      );
    }

    return NextResponse.json({ spaces: spaces || [] }, { status: 200 });
  } catch (error) {
    console.error('Error in spaces API:', error);
    await saveError(
        'Spaces Fetch Exception Error',
        '/api/get-credits',
        `Failed to fetch spaces\n\n${JSON.stringify(error)}`,
        request.nextUrl.href
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}