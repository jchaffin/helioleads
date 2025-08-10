export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>HelioLeads</h1>
      <p>Dashboard is running. API routes are under /api.</p>
      <ul>
        <li>
          TwiML webhook: <code>/api/voice</code>
        </li>
        <li>
          Status callback: <code>/api/voice-status</code>
        </li>
      </ul>
    </main>
  );
}

