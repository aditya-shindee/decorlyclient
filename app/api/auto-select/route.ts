import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Create a job record in the database
    const { data: job, error: jobError } = await supabase
      .from('job_status')
      .insert({
        user_id: payload.user_id,
        space_id: payload.space_id,
        job_type: 'auto_select',
        status: 'pending',
        payload: payload
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }

    // Trigger the Netlify Background Function
    try {
      const backgroundFunctionUrl = `${process.env.NETLIFY_URL}/.netlify/functions/process-background-job-background`;

      // Make a POST request to trigger the background function
      const response = await fetch(backgroundFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          jobType: 'auto_select',
          payload: payload
        })
      });

      if (!response.ok) {
        throw new Error(`Background function failed: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error triggering background function:', error);
      // Update job status to failed
      await supabase
        .from('job_status')
        .update({ 
          status: 'failed', 
          error_message: 'Failed to trigger background function',
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id);
      return NextResponse.json(
        { error: 'Failed to start background processing' },
        { status: 500 }
      );
    }

    // Return immediately with job ID
    return NextResponse.json({
      job_id: job.id,
      status: 'pending',
      message: 'Auto-select job created successfully'
    });

  } catch (error) {
    console.error('Error in auto-select API:', error);
    return NextResponse.json(
      { error: 'Failed to create auto-select job' },
      { status: 500 }
    );
  }
} 