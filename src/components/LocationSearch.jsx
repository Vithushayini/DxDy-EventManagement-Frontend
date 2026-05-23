import { useState } from "react";

export default function LocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        value
      )}&limit=5`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "smart-event-management-platform/1.0",
        },
      });

      const data = await response.json();

      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setResults([]);

    console.log({
      lat: place.lat,
      lng: place.lon,
      address: place.display_name,
    });
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => searchLocations(e.target.value)}
        placeholder="Search location..."
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
      />

      {loading && (
        <div className="mt-2 text-sm text-slate-400">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
          {results.map((place) => (
            <button
              key={place.place_id}
              type="button"
              onClick={() => handleSelect(place)}
              className="block w-full border-b border-slate-800 px-4 py-3 text-left text-sm text-white hover:bg-slate-800"
            >
              {place.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}