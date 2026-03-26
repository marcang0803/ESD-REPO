export default function Toast({ message, type = 'info', isVisible }) {
  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  };

  return (
    <div className={`fixed bottom-20 left-4 right-4 max-w-md mx-auto ${bgColor[type]} text-white px-4 py-3 rounded-xl shadow-lg z-40 animate-fade-in`}>
      {message}
    </div>
  );
}
