import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const productId = searchParams.get('productId');

  if (!fileName || !productId) {
    return NextResponse.json({ error: 'Missing fileName or productId' }, { status: 400 });
  }

  try {
    const existingFile = await prisma.prisma_mongo.file.findFirst({
      where: {
        name: fileName,
        productId: productId,
      },
    });

    console.log('Existing file:', existingFile); // Add this line for debugging

    return NextResponse.json({ isDuplicate: !!existingFile });
  } catch (error) {
    console.error('Error checking for duplicate file:', error);
    return NextResponse.json({ error: 'Failed to check for duplicate file' }, { status: 500 });
  }
}
