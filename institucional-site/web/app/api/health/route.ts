import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    release: process.env.APP_RELEASE ?? 'unknown',
    buildTime: process.env.APP_BUILD_TIME ?? 'unknown',
    siteImage: process.env.SITE_IMAGE ?? 'unknown',
  });
}
