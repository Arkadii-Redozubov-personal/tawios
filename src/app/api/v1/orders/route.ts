import { NextResponse } from 'next/server';
import { CheckoutOrderSchema } from '@/lib/validation';
import { createDemoOrderSnapshot } from '@/server/services/order-service';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'INVALID_JSON', message: 'Malformed JSON body.' },
      { status: 400 }
    );
  }

  const parsed = CheckoutOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'VALIDATION_ERROR',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const result = createDemoOrderSnapshot(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.code, message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      demoMode: true,
      notice:
        'Demo order snapshot generated. No real payment was captured and no live webhook ran.',
      order: result.order,
    },
    { status: 201 }
  );
}

