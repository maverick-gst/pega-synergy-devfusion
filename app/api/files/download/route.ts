import { NextResponse } from 'next/server';
import { downloadFile } from '@/lib/gcs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  console.log('fileName-------', fileName);
  if (!fileName) {
    return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
  }

  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    return NextResponse.json({ error: 'GCS_BUCKET_NAME not set' }, { status: 500 });
  }

  try {
    const fileContent = await downloadFile(bucketName, fileName);
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
