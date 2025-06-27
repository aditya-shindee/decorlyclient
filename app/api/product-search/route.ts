import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    const res = await axios.post(`${process.env.BACKEND_API_URL}/catalog-product-search`, payload, {
      headers: {
        "X-API-Key": process.env.DECOR_API_KEY,
        "X-User-ID": payload.user_id,
        "Content-Type": "application/json",
      },
    });
    
    return NextResponse.json(res.data);
  } catch (error) {
    console.error('Error in product search API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product recommendations' },
      { status: 500 }
    );
  }
} 