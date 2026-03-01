"use client";

import { useState } from 'react';
import { searchArtworks } from '@/lib/api';

export default function PlaceSearch({ onSelect, onCancel, selectedIds = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const data = await searchArtworks(query.trim());
      setResults(data);
      if (data.length === 0) setError('No artworks found for that query.');
    } catch {
      setError('Failed to search artworks. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search Art Institute of Chicago…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-primary" disabled={searching}>
          {searching ? 'Searching…' : 'Search'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-sm btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {results.length > 0 && (
        <ul className="list-group" style={{ maxHeight: 300, overflowY: 'auto' }}>
          {results.map((artwork) => {
            const alreadyAdded = selectedIds.includes(artwork.id);
            return (
              <li
                key={artwork.id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2"
              >
                <div className="d-flex align-items-center gap-2">
                  {artwork.image_url && (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      style={{ width: 40, height: 40, objectFit: 'cover' }}
                      className="rounded"
                    />
                  )}
                  <span className="small">{artwork.title}</span>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={() => onSelect(artwork)}
                  disabled={alreadyAdded}
                >
                  {alreadyAdded ? 'Added' : 'Add'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
