import { NextResponse } from 'next/server';
import { deleteFile } from '@/lib/gcs';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');

  if (!fileName) {
    return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
  }

  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    return NextResponse.json({ error: 'GCS_BUCKET_NAME not set' }, { status: 500 });
  }

  try {
    await deleteFile(bucketName, fileName);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
