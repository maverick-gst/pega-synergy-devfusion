import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: JSON.parse(process.env.GCS_CREDENTIALS || '{}'),
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log('id-------', id);
  try {
    // Fetch file metadata from the database
    const file = await prisma.prisma_mongo.file.findUnique({
      where: { id },
    });

    console.log('File metadata:', file);

    if (!file) {
      console.log('File not found in database');
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get the file from Google Cloud Storage
    console.log('Attempting to download from GCS:', file.name);
    const [fileContent] = await bucket.file(file.name).download();
    console.log('File downloaded from GCS');

    // Set appropriate headers for the response
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${file.name}"`);
    headers.set('Content-Type', file.contentType);

    // Return the file content as a stream
    return new NextResponse(fileContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('.........Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
