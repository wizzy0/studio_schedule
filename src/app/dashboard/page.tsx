'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Schedule } from '@/types'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loadingSchedules, setLoadingSchedules] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user) {
      fetchSchedules()
    }
  }, [user, loading, router])

  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true)
      console.log('Fetching schedules from Supabase...')
      
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

      console.log('Schedules fetched successfully:', data)
      setSchedules(data || [])
    } catch (error) {
      console.error('Unexpected error fetching schedules:', error)
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Tambahkan fungsi untuk booking schedule
  const handleBookSchedule = async (scheduleId: string) => {
    if (!user) return;
    console.log('Booking schedule:', scheduleId, 'for user:', user.id);
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update({ status: 'booked', user_id: user.id })
        .eq('id', scheduleId)
        .select();
      console.log('Supabase update result:', { data, error });
      if (error) {
        alert('Failed to book schedule: ' + error.message + '\nDetails: ' + (error.details || '-') + '\nHint: ' + (error.hint || '-'));
        return;
      }
      if (data && data.length > 0) {
        alert('Booking berhasil!');
      } else {
        alert('Tidak ada data yang berubah.');
      }
      fetchSchedules();
    } catch (err) {
      alert('Unexpected error: ' + err);
      console.error('Unexpected error:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const availableSchedules = schedules.filter(s => s.status === 'available')
  const bookedSchedules = schedules.filter(s => s.status === 'booked')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Studio Schedule Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}!</span>
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Studio Schedule!</h2>
            <p className="text-gray-600 mb-6">
              You are successfully logged in as {user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Available Slots</p>
                  <p className="text-2xl font-semibold text-gray-900">{availableSchedules.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Booked Slots</p>
                  <p className="text-2xl font-semibold text-gray-900">{bookedSchedules.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Schedules</p>
                  <p className="text-2xl font-semibold text-gray-900">{schedules.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Studio Schedules</h3>
                <button
                  onClick={fetchSchedules}
                  disabled={loadingSchedules}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  {loadingSchedules ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingSchedules ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading schedules...</p>
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No schedules available at the moment.</p>
                  <p className="text-sm text-gray-400 mt-1">Check back later for new schedules.</p>
                </div>
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
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(schedule.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {schedule.time_slot}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              schedule.status === 'available' ? 'bg-green-100 text-green-800' :
                              schedule.status === 'booked' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {schedule.status === 'available' || schedule.status === 'cancelled' ? (
                              <button
                                className="text-blue-600 hover:text-blue-900 font-medium"
                                onClick={() => handleBookSchedule(schedule.id)}
                              >
                                Book Now
                              </button>
                            ) : schedule.status === 'booked' ? (
                              <span className="text-gray-500">Booked</span>
                            ) : (
                              <span className="text-gray-500">Cancelled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Actions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click "Book Now" on any available slot to make a reservation</li>
              <li>• Use the "Refresh" button to see the latest schedules</li>
              <li>• Contact the studio admin for any special requests</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
