import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function POST(request: Request) {
  try {
    const { name, size, contentType, url, productId, stepId, subStepId, systemGenerated } = await request.json();
    const file = await prisma.prisma_mongo.file.create({
      data: {
        name,
        size,
        contentType,
        url,
        productId,
        stepId,
        subStepId,
        systemGenerated: systemGenerated || false,
      },
    });
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const stepId = searchParams.get('stepId');
  const subStepId = searchParams.get('subStepId');

  try {
    const files = await prisma.prisma_mongo.file.findMany({
      where: {
        productId: productId || undefined,
        stepId: stepId ? parseInt(stepId) : undefined,
        subStepId: subStepId ? parseInt(subStepId) : undefined,
      },
    });
    console.log('files', files);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const body = await request.json();

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 });
  }

  try {
    const updatedFile = await prisma.prisma_mongo.file.updateMany({
      where: {
        name: fileName,
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
        name: fileName,
        productId: body.productId,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}
