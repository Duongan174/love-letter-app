import { NextRequest, NextResponse } from 'next/server';

const ZALO_APP_ID = process.env.ZALO_APP_ID;
const ZALO_APP_SECRET = process.env.ZALO_APP_SECRET;
const ZALO_REDIRECT_URI = process.env.ZALO_REDIRECT_URI;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    // Redirect to Zalo OAuth
    const authUrl = `https://oauth.zalo.me/v4/oa/permission?app_id=${ZALO_APP_ID}&redirect_uri=${encodeURIComponent(ZALO_REDIRECT_URI || '')}&state=random_state`;
    return NextResponse.redirect(authUrl);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth.zalo.me/v4/oa/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        app_id: ZALO_APP_ID || '',
        app_secret: ZALO_APP_SECRET || '',
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Get user info
      const userResponse = await fetch('https://graph.zalo.me/v2.0/me', {
        headers: {
          'access_token': tokenData.access_token,
        },
      });

      const userData = await userResponse.json();

      // Return user data (in production, save to database and create session)
      return NextResponse.json({
        success: true,
        user: userData,
        access_token: tokenData.access_token,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to get access token' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Zalo auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

