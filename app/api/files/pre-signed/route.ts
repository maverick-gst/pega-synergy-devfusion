import { NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/gcs';

export async function POST(request: Request) {
  try {
    console.log('Upload URL request received');
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 });
    }

    const bucketName = process.env.GCS_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json({ error: 'GCS_BUCKET_NAME not set' }, { status: 500 });
    }

    const uploadUrl = await generateUploadUrl(bucketName, fileName, contentType);
    console.log("Generated upload URL:", uploadUrl);
    return NextResponse.json({ uploadUrl });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
