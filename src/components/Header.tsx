export default function Header({
  onReset,
}: {
  onReset: () => void; // Prop to reset the state
}) {
  return (
    <header className="w-full p-4 flex items-center justify-center">
      <button
        onClick={onReset} // Reset state when the title is clicked
        className="text-3xl font-bold text-white font-orbitron p-2 cursor-pointer"
      >
        D2 API Timer
      </button>
    </header>
  );
}