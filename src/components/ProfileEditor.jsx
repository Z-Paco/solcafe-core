"use client";

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import AvatarUpload from './AvatarUpload';

export default function ProfileEditor({ profile, userId, onSave }) {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    console.log("Updating profile with:", {
      display_name: displayName,
      username: username,
      bio: bio,
    });

    try {
      // Username validation - must be unique
      if (username !== profile?.username) {
        const { data: usernameCheck, error: usernameError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .not('id', 'eq', userId)
          .single();

        if (usernameCheck) {
          setError('Username is already taken');
          setLoading(false);
          return;
        }
      }

      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          username: username,
          bio: bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      console.log("Profile updated successfully:", data);
      setSuccessMessage('Profile updated successfully!');
      
      if (onSave) {
        onSave({
          display_name: displayName,
          username: username,
          bio: bio,
          avatar_url: avatarUrl
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarUpload(url) {
    setAvatarUrl(url);
    setSuccessMessage('Avatar updated successfully!');
  }

  async function deleteProfile() {
    if (!confirm("Are you sure you want to delete your profile? This cannot be undone.")) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      // Redirect to home or reload page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting profile:", error);
      setError("Failed to delete profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-editor">
      <div className="profile-editor-avatar">
        <AvatarUpload
          userId={userId}
          url={avatarUrl ? 
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}` : 
            undefined
          }
          onUpload={handleAvatarUpload}
        />
      </div>

      <form onSubmit={updateProfile} className="profile-editor-form">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
            className="profile-input"
          />
          <small>Unique username, no spaces allowed</small>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="profile-input"
          />
        </div>

        <button 
          type="submit" 
          className="profile-save-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>

        <button 
          type="button" 
          onClick={deleteProfile}
          className="profile-delete-button"
        >
          Delete Profile
        </button>
      </form>
    </div>
  );
}