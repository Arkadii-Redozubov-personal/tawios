import { NextResponse } from 'next/server';
import { getPublishedProducts } from '@/server/services/catalog-service';

export async function GET() {
  const products = getPublishedProducts();
  return NextResponse.json({
    demoMode: true,
    baseCurrency: 'PLN',
    count: products.length,
    products,
  });
}

