import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar,Edit3 } from 'lucide-react';
import { apiCall } from '../utils/api';

const ProfileView = ({ user, onLogout, onEdit }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const details = await apiCall(`/user/${user.id}/details`);
        setUserDetails(details);
      } catch (error) {
        setError('Failed to load user details');
        console.error('Failed to load user details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [user.id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const formatGender = (gender) => {
    if (!gender) return 'Not specified';
    return gender.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-blue-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-gray-800">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="text-gray-800">{userDetails?.age || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-gray-800">{formatGender(userDetails?.gender)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-800">{userDetails?.phone || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <div className="text-gray-800">
                  {userDetails?.address && (
                    <p className="mb-2">{userDetails.address}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-sm">
                    {userDetails?.city && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {userDetails.city}
                      </span>
                    )}
                    {userDetails?.state && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {userDetails.state}
                      </span>
                    )}
                    {userDetails?.postal_code && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {userDetails.postal_code}
                      </span>
                    )}
                  </div>
                  {!userDetails?.address && !userDetails?.city && !userDetails?.state && !userDetails?.postal_code && (
                    <p className="text-gray-500">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Occupation</p>
              <p className="text-gray-800">{userDetails?.occupation || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="text-sm text-gray-600">
            <p>Account ID: {user.id}</p>
            <p>Member since: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;