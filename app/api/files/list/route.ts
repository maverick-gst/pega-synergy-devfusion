import { NextResponse } from 'next/server';
import { listFiles, getFileMetadata } from '@/lib/gcs';

export async function GET(request: Request) {
  try {
    console.log('File list request received');
    const bucketName = process.env.GCS_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json({ error: 'GCS_BUCKET_NAME not set' }, { status: 500 });
    }

    const files = await listFiles(bucketName);
    const filesWithMetadata = await Promise.all(
      files.map(async (fileName) => {
        const metadata = await getFileMetadata(bucketName, fileName);
        return {
          name: fileName,
          size: metadata.size,
          contentType: metadata.contentType,
          updated: metadata.updated,
          // Add any other relevant metadata fields
        };
      })
    );

    console.log(`Retrieved ${filesWithMetadata.length} files`);
    return NextResponse.json({ files: filesWithMetadata });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
