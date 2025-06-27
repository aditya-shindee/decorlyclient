import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const BACKEND_API_URL = process.env.BACKEND_API_URL;
    console.log('BACKEND_API_URL:', BACKEND_API_URL);
    
    const res = await axios.post(`${BACKEND_API_URL}/catalog-product-search`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return NextResponse.json(res.data);
  } catch (error) {
    console.error('Error in product search API:', {
      message: (error as Error).message,
    });
    return NextResponse.json(
      { error: 'Failed to fetch product recommendations' },
      { status: 500 }
    );
  }
} 
