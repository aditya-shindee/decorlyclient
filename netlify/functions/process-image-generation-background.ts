import { Handler } from '@netlify/functions';
import axios from 'axios';

// Import Supabase client for background functions
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
  // Set CORS headers for background functions
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { jobId, jobType, payload } = JSON.parse(event.body || '{}');
    
    if (!jobId || !jobType || !payload) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing jobId, jobType, or payload' })
      };
    }

    // Update job status to processing
    await supabase
      .from('job_status')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    let res;
    
    // Handle different job types
    switch (jobType) {
      case 'image_generation':
        res = await axios.post(`${process.env.BACKEND_API_URL}/generate-image`, payload, {
          headers: {
            "X-API-Key": process.env.DECOR_API_KEY,
            "X-User-ID": payload.user_id,
            "Content-Type": "application/json",
          },
          timeout: 300000, // 5 minutes timeout
        });
        break;
        
      case 'product_search':
        res = await axios.post(`${process.env.BACKEND_API_URL}/catalog-product-search`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 300000, // 5 minutes timeout
        });
        break;
        
      default:
        throw new Error(`Unknown job type: ${jobType}`);
    }

    // Update job status to completed with result
    await supabase
      .from('job_status')
      .update({ 
        status: 'completed',
        result: res.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        jobId,
        jobType,
        result: res.data 
      })
    };

  } catch (error: any) {
    console.error('Error in background function:', error);
    
    // Try to update job status to failed if we have a jobId
    try {
      const { jobId } = JSON.parse(event.body || '{}');
      if (jobId) {
        await supabase
          .from('job_status')
          .update({ 
            status: 'failed', 
            error_message: error.message || 'Background processing failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);
      }
    } catch (updateError) {
      console.error('Error updating job status to failed:', updateError);
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Background processing failed',
        details: error.message 
      })
    };
  }
}; 