"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PlaceCard from '@/components/PlaceCard';
import PlaceSearch from '@/components/PlaceSearch';
import { getProject, addPlace, updatePlace } from '@/lib/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddPlace, setShowAddPlace] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProject(id);
      setProject(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handlePlaceAdded = async (artwork) => {
    setError(null);
    try {
      await addPlace(id, { external_id: artwork.id });
      setShowAddPlace(false);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add place.');
    }
  };

  const handlePlaceUpdated = async (placeId, data) => {
    setError(null);
    try {
      await updatePlace(id, placeId, data);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update place.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const placeCount = project.places?.length || 0;

  return (
    <div>
      <Link href="/" className="btn btn-outline-secondary btn-sm mb-3">
        &larr; Back to Projects
      </Link>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="card-title mb-1">
                {project.name}
                {project.is_completed && (
                  <span className="badge bg-success ms-2 fs-6">Completed ✓</span>
                )}
              </h2>
              {project.description && (
                <p className="card-text text-muted">{project.description}</p>
              )}
              {project.start_date && (
                <p className="card-text mb-0">
                  <small className="text-muted">Start date: {project.start_date}</small>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          Places{' '}
          <span className="badge bg-secondary">
            {placeCount}/10
          </span>
        </h4>
        {placeCount < 10 && !project.is_completed && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowAddPlace((v) => !v)}
          >
            {showAddPlace ? 'Cancel' : '+ Add Place'}
          </button>
        )}
      </div>

      {showAddPlace && (
        <div className="card mb-4">
          <div className="card-body">
            <PlaceSearch
              onSelect={handlePlaceAdded}
              onCancel={() => setShowAddPlace(false)}
              selectedIds={(project.places || []).map((p) => p.external_id)}
            />
          </div>
        </div>
      )}

      {placeCount === 0 ? (
        <div className="text-center text-muted py-4">
          <p>No places yet. Add artworks to start planning your trip!</p>
        </div>
      ) : (
        <div className="row g-4">
          {project.places.map((place) => (
            <div key={place.id} className="col-md-6 col-lg-4">
              <PlaceCard place={place} onUpdate={handlePlaceUpdated} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
