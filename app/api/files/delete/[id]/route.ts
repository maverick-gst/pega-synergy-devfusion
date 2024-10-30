import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const file = await prisma.prisma_mongo.file.findUnique({
      where: { id: params.id },
    });
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, size, contentType, url, productId, stepId, subStepId } = await request.json();
    const file = await prisma.prisma_mongo.file.update({
      where: { id: params.id },
      data: {
        name,
        size,
        contentType,
        url,
        productId,
        stepId,
        subStepId,
      },
    });
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.prisma_mongo.file.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
