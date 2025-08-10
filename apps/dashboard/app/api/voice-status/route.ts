export async function POST(req: Request) {
  try {
    // Twilio posts application/x-www-form-urlencoded by default
    const body = await req.text();
    console.log("[twilio-status]", body);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[twilio-status] error", err);
    return new Response("error", { status: 500 });
  }
}

