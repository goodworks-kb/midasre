import { NextRequest, NextResponse } from 'next/server';
import { deleteListing } from '@/lib/storage';
import { redirect } from 'next/navigation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  deleteListing(params.id);
  redirect('/admin');
}
