import { supabase } from "@/lib/supabase";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const amount = searchParams.get('amount'); // Default to 10 if not provided
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!amount) {
      return NextResponse.json({ error: 'amount is required' }, { status: 400 });
    }

    const deductAmount = parseInt(amount);
    if (isNaN(deductAmount) || deductAmount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // First, get current credits to ensure sufficient balance
    const { data: currentCredits, error: fetchError } = await supabase
      .from('credits')
      .select('amount')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch current credits' }, { status: 500 });
    }

    if (currentCredits.amount < deductAmount) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // Deduct the credits
    const { data: updatedCredits, error: updateError } = await supabase
      .from('credits')
      .update({ amount: currentCredits.amount - deductAmount })
      .eq('user_id', userId)
      .select('amount')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      previousAmount: currentCredits.amount,
      newAmount: updatedCredits.amount,
      deductedAmount: deductAmount
    });

  } catch (error) {
    console.error('Error deducting credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 