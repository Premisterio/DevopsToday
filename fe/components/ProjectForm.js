"use client";

import { useState } from 'react';
import { createProject, getErrorMessage } from '@/lib/api';
import PlaceSearch from './PlaceSearch';

export default function ProjectForm({ onCreated, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPlace = (artwork) => {
    if (selectedPlaces.length >= 10) {
      setError('Maximum 10 places per project.');
      return;
    }
    if (selectedPlaces.find((p) => p.id === artwork.id)) {
      setError('That place is already in the list.');
      return;
    }
    setSelectedPlaces((prev) => [...prev, artwork]);
    setError(null);
  };

  const handleRemovePlace = (artworkId) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== artworkId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createProject({
        name: name.trim(),
        description: description.trim() || null,
        start_date: startDate || null,
        places: selectedPlaces.map((p) => p.id),
      });
      onCreated?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create project.'));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Travel Project</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. My Chicago Art Tour"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes about this trip"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Places ({selectedPlaces.length}/10)
                </label>
                <br />
                {selectedPlaces.length > 0 && (
                  <ul className="list-group mb-2">
                    {selectedPlaces.map((p) => (
                      <li
                        key={p.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center gap-2">
                          {p.image_url && (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              style={{ width: 36, height: 36, objectFit: 'cover' }}
                              className="rounded"
                            />
                          )}
                          <span className="small">{p.title}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemovePlace(p.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {selectedPlaces.length < 10 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowSearch((v) => !v)}
                  >
                    {showSearch ? 'Hide search' : '+ Search artworks'}
                  </button>
                )}

                {showSearch && (
                  <div className="mt-2">
                    <PlaceSearch
                      onSelect={handleSelectPlace}
                      selectedIds={selectedPlaces.map((p) => p.id)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
