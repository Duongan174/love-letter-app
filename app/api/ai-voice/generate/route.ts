import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock AI Voice Generation
// In production, integrate with ElevenLabs API or similar
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export async function POST(request: NextRequest) {
  try {
    const { cardId, message, senderName } = await request.json();

    if (!cardId || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get voice sample for this card
    const { data: voiceSample } = await supabase
      .from('voice_samples')
      .select('audio_url')
      .eq('card_id', cardId)
      .eq('status', 'processed')
      .single();

    if (!voiceSample) {
      return NextResponse.json(
        { success: false, error: 'Voice sample not found or not processed' },
        { status: 404 }
      );
    }

    // Generate AI voice using ElevenLabs API
    // This is a mock - replace with actual API call
    if (ELEVENLABS_API_KEY && ELEVENLABS_VOICE_ID) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: message,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error('ElevenLabs API error');
        }

        const audioBuffer = await response.arrayBuffer();
        
        // Upload generated audio to storage
        const fileName = `ai-voices/${cardId}-${Date.now()}.mp3`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ai-voices')
          .upload(fileName, audioBuffer, {
            contentType: 'audio/mpeg',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('ai-voices')
          .getPublicUrl(fileName);

        // Save to database
        await supabase.from('ai_voices').insert({
          card_id: cardId,
          audio_url: urlData.publicUrl,
          status: 'ready',
        });

        return NextResponse.json({
          success: true,
          audioUrl: urlData.publicUrl,
        });
      } catch (apiError: any) {
        console.error('ElevenLabs API error:', apiError);
        // Fallback to mock
      }
    }

    // Mock response for development
    return NextResponse.json({
      success: true,
      audioUrl: '/api/mock-voice.mp3', // Mock audio file
      message: 'Using mock voice. Configure ElevenLabs API for production.',
    });
  } catch (error: any) {
    console.error('Error generating AI voice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

