import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function PUT(request: Request, { params }: { params: { fileName: string } }) {
  const { fileName } = params;
  const body = await request.json();

  try {
    const updatedFile = await prisma.prisma_mongo.file.updateMany({
      where: {
        name: decodeURIComponent(fileName),
        productId: body.productId,
      },
      data: {
        size: body.size,
        contentType: body.contentType,
        url: body.url,
        stepId: body.stepId,
        subStepId: body.subStepId,
      },
    });

    if (updatedFile.count === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Fetch the updated file to return
    const file = await prisma.prisma_mongo.file.findFirst({
      where: {
        name: decodeURIComponent(fileName),
        productId: body.productId,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}


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
