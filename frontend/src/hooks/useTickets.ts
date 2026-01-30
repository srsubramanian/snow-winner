import { useState, useEffect, useCallback } from 'react';
import type { ChangeTicket, TicketListResponse, DashboardStats, TicketFilters } from '@/types/ticket';
import { fetchTickets, fetchTicket, fetchStats } from '@/services/api';

export function useTickets(filters: TicketFilters = {}) {
  const [data, setData] = useState<TicketListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTickets(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.compliance, filters.assignee, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return { data, loading, error, refetch: loadTickets };
}

export function useTicket(id: string | null) {
  const [data, setData] = useState<ChangeTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    const loadTicket = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTicket(id);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  return { data, loading, error };
}

export function useStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchStats();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { data, loading, error };
}
