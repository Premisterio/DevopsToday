"use client";

import Link from 'next/link';
import { useState } from 'react';
import { deleteProject } from '@/lib/api';

export default function ProjectCard({ project, onDeleted }) {
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm(`Delete project "${project.name}"?`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProject(project.id);
      onDeleted?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete project.');
      setDeleting(false);
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="card-title mb-0">{project.name}</h5>
          {project.is_completed && (
            <span className="badge bg-success ms-2">Completed ✓</span>
          )}
        </div>

        {project.description && (
          <p className="card-text text-muted small mt-1">{project.description}</p>
        )}

        {project.start_date && (
          <p className="card-text mb-1">
            <small className="text-muted">Start: {project.start_date}</small>
          </p>
        )}

        {error && (
          <div className="alert alert-danger py-1 small mt-2">{error}</div>
        )}
      </div>

      <div className="card-footer d-flex gap-2 bg-transparent">
        <Link
          href={`/projects/${project.id}`}
          className="btn btn-sm btn-primary flex-grow-1"
        >
          View
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
