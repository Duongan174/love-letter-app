import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const cardId = formData.get('cardId') as string;

    if (!audioFile || !cardId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const fileName = `voice-samples/${cardId}-${Date.now()}.webm`;
    const { data, error } = await supabase.storage
      .from('voice-samples')
      .upload(fileName, audioFile, {
        contentType: 'audio/webm',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('voice-samples')
      .getPublicUrl(fileName);

    // Save to database
    await supabase.from('voice_samples').insert({
      card_id: cardId,
      audio_url: urlData.publicUrl,
      status: 'processing',
    });

    return NextResponse.json({
      success: true,
      audioUrl: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Error uploading voice sample:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

