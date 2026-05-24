import { useState, useRef } from "react";

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  const searchLocations = (value) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          value
        )}&limit=5`;

        const response = await fetch(url);
        const data = await response.json();

        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleSelect = (place) => {
    const fullAddress = place.display_name || "";

    // 🔥 IMPORTANT: extract parts (basic split logic)
    const parts = fullAddress.split(",");

    const city = parts[parts.length - 3]?.trim() || "";
    const country = parts[parts.length - 1]?.trim() || "";

    // const selectedData = {
    //   name: fullAddress,
    //   address: fullAddress,
    //   city,
    //   country,
    //   lat: place.lat,
    //   lng: place.lon
    // };

    const selectedData = {
      name: parts[0]?.trim() || place.display_name,
      address: place.display_name,
      city: place.address?.city || place.address?.town || city,
      country: place.address?.country || country,
      lat: place.lat,
      lng: place.lon
    };

    setQuery(fullAddress);
    setResults([]);

    // send to parent
    if (onSelect) onSelect(selectedData);
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => searchLocations(e.target.value)}
        placeholder="Search location..."
        className="w-full input"
      />

      {loading && <p className="text-sm text-gray-400">Searching...</p>}

      {results.length > 0 && (
        <div className="absolute z-50 w-full bg-slate-900 border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
          {results.map((place) => (
            <button
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="block w-full text-left px-3 py-2 hover:bg-slate-800 text-white"
            >
              {place.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}