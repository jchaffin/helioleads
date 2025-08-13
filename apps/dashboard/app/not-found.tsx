export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-gray-500">The resource you are looking for doesn’t exist.</p>
        <a href="/" className="text-orange-600 hover:underline">Go back home</a>
      </div>
    </div>
  )
}

