export default function SearchBar({ onSearch }: { onSearch: (bungieName: string) => void }) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bungieName = formData.get('bungieName') as string;
    if (bungieName) {
      onSearch(bungieName);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center gap-4 p-4 transparent-bg shadow rounded"
    >
      <input
        type="text"
        name="bungieName"
        placeholder="Enter Bungie Name"
        className="w-full max-w-md px-4 py-2 text-gray-600 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-gray-100 bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Search
      </button>
    </form>
  );
}