import { NextResponse } from 'next/server';
import { CURRENCIES_SEED } from '@/server/data/currencies-seed';

export async function GET() {
  return NextResponse.json({
    demoMode: true,
    baseCurrency: 'PLN',
    settlementCurrency: 'PLN',
    currencies: CURRENCIES_SEED,
  });
}

