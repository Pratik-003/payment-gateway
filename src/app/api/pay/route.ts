import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Read the incoming payload (card details, amount, etc.)
    // We don't actually process it, but in a real app, we would!
    const _body = await request.json();

    // Add a base delay to simulate normal network travel and "Processing" time (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a random number between 0 and 1 to determine the outcome
    const random = Math.random();

    // Outcome 1: Timeout Simulation (~15% chance)
    // We force the server to sleep for 8 seconds. 
    // Our frontend will use AbortController to kill this request at the 6-second mark.
    if (random < 0.15) {
      await new Promise((resolve) => setTimeout(resolve, 8000));
      return NextResponse.json(
        { status: 'Timeout', message: 'Gateway timeout' }, 
        { status: 504 }
      );
    }

    // Outcome 2: Failure Simulation (~25% chance)
    // Between 0.15 and 0.40
    if (random >= 0.15 && random < 0.40) {
      const failureReasons = [
        'Insufficient funds',
        'Card declined by issuer',
        'Suspected fraud',
        'Invalid CVV'
      ];
      // Pick a random failure reason
      const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      
      return NextResponse.json(
        { status: 'Failed', reason: randomReason }, 
        { status: 400 }
      );
    }

    // Outcome 3: Success Simulation (~60% chance)
    // Greater than 0.40
    return NextResponse.json(
      { status: 'Success', message: 'Payment processed successfully', transactionId: crypto.randomUUID() }, 
      { status: 200 }
    );

  } catch (error) {
    // Fallback error handler
    return NextResponse.json(
      { status: 'Failed', reason: 'Internal server error' }, 
      { status: 500 }
    );
  }
}