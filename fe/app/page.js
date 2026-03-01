"use client";

import { useState, useEffect, useCallback } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { getProjects, getErrorMessage } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects(page, limit);
      setProjects(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load projects.'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreated = () => {
    setShowModal(false);
    if (page === 1) {
      fetchProjects();
    } else {
      setPage(1);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Travel Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="fs-5">No travel projects yet.</p>
          <p>Click <strong>"Add New"</strong> to start planning!</p>
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <ProjectCard project={project} onDeleted={fetchProjects} />
            </div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            &laquo; Previous
          </button>
          <span className="text-muted">Page {page}</span>
          <button
            className="btn btn-outline-secondary"
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next &raquo;
          </button>
        </div>
      )}

      {showModal && (
        <ProjectForm onCreated={handleCreated} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
