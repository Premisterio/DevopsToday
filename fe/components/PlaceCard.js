"use client";

import { useState } from 'react';

export default function PlaceCard({ place, onUpdate }) {
  const [notes, setNotes] = useState(place.notes || '');
  const [saving, setSaving] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveNotes = async () => {
    setSaving(true);
    setError(null);
    try {
      await onUpdate(place.id, { notes });
    } catch {
      setError('Failed to save notes.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkVisited = async () => {
    if (!confirm('Mark this place as visited? This cannot be undone.')) return;
    setMarking(true);
    setError(null);
    try {
      await onUpdate(place.id, { is_visited: true });
    } catch {
      setError('Failed to mark as visited.');
      setMarking(false);
    }
  };

  return (
    <div className={`card h-100 shadow-sm ${place.is_visited ? 'border-success' : ''}`}>
      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.title}
          className="card-img-top"
          style={{ height: 160, objectFit: 'cover' }}
        />
      )}

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0">{place.title}</h6>
          {place.is_visited && (
            <span className="badge bg-success ms-2">Visited ✓</span>
          )}
        </div>

        {error && <div className="alert alert-danger py-1 small">{error}</div>}

        <div className="mb-2 flex-grow-1">
          <label className="form-label small text-muted mb-1">Notes</label>
          <textarea
            className="form-control form-control-sm"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={place.is_visited}
            placeholder="Add your notes about this place…"
          />
        </div>

        {!place.is_visited && (
          <div className="d-flex gap-2 mt-auto">
            <button
              className="btn btn-sm btn-outline-secondary flex-grow-1"
              onClick={handleSaveNotes}
              disabled={saving || notes === (place.notes || '')}
            >
              {saving ? 'Saving…' : 'Save Notes'}
            </button>
            <button
              className="btn btn-sm btn-success"
              onClick={handleMarkVisited}
              disabled={marking}
            >
              {marking ? '…' : 'Mark Visited'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
