export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Schedule {
  id: string
  user_id?: string
  date: string
  time_slot: string
  status: 'available' | 'booked' | 'cancelled'
  created_at: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
} 