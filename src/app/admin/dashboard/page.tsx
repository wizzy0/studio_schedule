'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Schedule } from '@/types'
import { supabase } from '@/lib/supabase'

export default function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    } else if (!loading && user && user.role !== 'admin') {
      // Redirect non-admin users to regular dashboard
      router.push('/dashboard')
    } else if (!loading && user && user.role === 'admin') {
      // Load schedules when admin is logged in
      fetchSchedules()
    }
  }, [user, loading, router])

  const fetchSchedules = async () => {
    try {
      console.log('Admin: Fetching schedules from Supabase...')
      
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching schedules:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return
      }

      console.log('Admin: Schedules fetched successfully:', data)
      setSchedules(data || [])
    } catch (error) {
      console.error('Unexpected error fetching schedules:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('Signing out...')
      await signOut()
      console.log('Sign out successful, redirecting...')
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Admin: {user.name}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Control Panel</h2>
            <p className="text-gray-600 mb-6">
              Welcome, {user.name}! You have admin privileges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manage Schedules Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Manage Schedules</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Add, edit, and delete studio schedules
                </p>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Manage Schedules
                </button>
              </div>

              {/* View Bookings Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">View Bookings</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  View all current and past bookings
                </p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                  View Bookings
                </button>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">0</div>
                  <div className="text-yellow-700">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{schedules.filter(s => s.status === 'available').length}</div>
                  <div className="text-yellow-700">Available Slots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{schedules.filter(s => s.status === 'booked').length}</div>
                  <div className="text-yellow-700">Booked Slots</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Management Modal */}
      {showScheduleModal && (
        <ScheduleManagementModal 
          onClose={() => setShowScheduleModal(false)}
          schedules={schedules}
          setSchedules={setSchedules}
          onScheduleChange={fetchSchedules}
        />
      )}
    </div>
  )
}

// Schedule Management Modal Component
interface ScheduleManagementModalProps {
  onClose: () => void
  schedules: Schedule[]
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>
  onScheduleChange: () => void
}

function ScheduleManagementModal({ onClose, schedules, setSchedules, onScheduleChange }: ScheduleManagementModalProps) {
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    time_slot: '',
    status: 'available' as 'available' | 'booked' | 'cancelled'
  })
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
    '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'
  ]

  const handleAddSchedule = async () => {
    if (!newSchedule.date || !newSchedule.time_slot) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      console.log('Admin: Adding new schedule:', newSchedule)
      
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          date: newSchedule.date,
          time_slot: newSchedule.time_slot,
          status: newSchedule.status,
          user_id: null // Admin-created schedules don't have a specific user
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding schedule:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        alert('Failed to add schedule: ' + error.message)
        return
      }

      console.log('Schedule added successfully:', data)
      setSchedules([...schedules, data])
      setNewSchedule({ date: '', time_slot: '', status: 'available' as 'available' | 'booked' | 'cancelled' })
      onScheduleChange()
    } catch (error) {
      console.error('Unexpected error adding schedule:', error)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setNewSchedule({
      date: schedule.date,
      time_slot: schedule.time_slot,
      status: schedule.status
    })
  }

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update({
          date: newSchedule.date,
          time_slot: newSchedule.time_slot,
          status: newSchedule.status
        })
        .eq('id', editingSchedule.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating schedule:', error)
        alert('Failed to update schedule: ' + error.message)
        return
      }

      console.log('Schedule updated successfully:', data)
      const updatedSchedules = schedules.map(s => 
        s.id === editingSchedule.id ? data : s
      )
      setSchedules(updatedSchedules)
      setEditingSchedule(null)
      setNewSchedule({ date: '', time_slot: '', status: 'available' as 'available' | 'booked' | 'cancelled' })
      onScheduleChange()
    } catch (error) {
      console.error('Unexpected error updating schedule:', error)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId)

      if (error) {
        console.error('Error deleting schedule:', error)
        alert('Failed to delete schedule: ' + error.message)
        return
      }

      console.log('Schedule deleted successfully')
      setSchedules(schedules.filter(s => s.id !== scheduleId))
      onScheduleChange()
    } catch (error) {
      console.error('Unexpected error deleting schedule:', error)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Studio Schedules</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Add/Edit Schedule Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                <select
                  value={newSchedule.time_slot}
                  onChange={(e) => setNewSchedule({...newSchedule, time_slot: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newSchedule.status}
                  onChange={(e) => setNewSchedule({...newSchedule, status: e.target.value as 'available' | 'booked' | 'cancelled'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {editingSchedule ? (
                <>
                  <button
                    onClick={handleUpdateSchedule}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {loading ? 'Updating...' : 'Update Schedule'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingSchedule(null)
                      setNewSchedule({ date: '', time_slot: '', status: 'available' as 'available' | 'booked' | 'cancelled' })
                    }}
                    disabled={loading}
                    className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel Edit
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddSchedule}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {loading ? 'Adding...' : 'Add Schedule'}
                </button>
              )}
            </div>
          </div>

          {/* Schedules List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Current Schedules</h3>
            {schedules.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No schedules found. Add some schedules above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.time_slot}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            schedule.status === 'available' ? 'bg-green-100 text-green-800' :
                            schedule.status === 'booked' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 