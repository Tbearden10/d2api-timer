export default function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-12 h-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        {/* Inner Glow */}
        <div className="absolute inset-2 border-4 border-t-transparent border-blue-300 rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
}