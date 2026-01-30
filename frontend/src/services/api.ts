import type { ChangeTicket, TicketListResponse, DashboardStats, TicketFilters } from '@/types/ticket';

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchTickets(filters: TicketFilters = {}): Promise<TicketListResponse> {
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.compliance) params.append('compliance', filters.compliance);
  if (filters.assignee) params.append('assignee', filters.assignee);
  if (filters.sortBy) params.append('sort_by', filters.sortBy);
  if (filters.sortOrder) params.append('sort_order', filters.sortOrder);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/tickets${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTicket(id: string): Promise<ChangeTicket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  return response.json();
}
