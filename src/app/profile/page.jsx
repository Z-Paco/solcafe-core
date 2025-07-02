"use client";

import ProfileEditor from "@/components/ProfileEditor";
import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/components/AvatarUpload";
import RoleBadge from "@/components/RoleBadge";
import Image from "next/image";
import "../styles/profile.css";

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("contributions");
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Redirect if not logged in (backup to middleware)
    if (!session && !loading) {
      router.push("/login");
      return;
    }

    // Redirect if not verified
    if (session && !session.user.email_confirmed_at) {
      router.push("/verify");
      return;
    }

    async function loadUserProfile() {
      try {
        console.log("Loading profile for user ID:", session?.user?.id);

        // First check if the user exists in the profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .single();

        if (error) {
          console.error("Error loading user data:", error);

          // If the error is that no rows were returned, create a profile
          if (error.code === "PGRST116") {
            console.log("No profile found, creating one...");

            // Create a new profile for this user
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: session?.user?.id,
                  display_name: session?.user?.email?.split("@")[0],
                  username: `user_${Math.floor(Math.random() * 10000)}`,
                  bio: "Tell us about yourself...",
                  primary_role: "Techie", // Default or from signup
                },
              ])
              .select();

            if (insertError) {
              console.error("Error creating profile:", insertError);
            } else {
              console.log("New profile created:", newProfile);
              setUserData(newProfile[0]);
            }
          }
        } else {
          console.log("Profile loaded successfully:", data);
          setUserData(data);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadUserProfile();
    }
  }, [session, loading, supabase, router]);

  // For testing purposes, add a simple log to see session state
  console.log("Session state:", session ? "Logged in" : "Not logged in");
  console.log("Current session:", session);
  console.log("Session user:", session?.user);

  // This comes from the authentication context or api
  const userProfile = loading
    ? {
        name: "Loading...",
        username: "loading",
        bio: "Loading profile data...",
        avatar: "/profiles/default-avatar.jpg",
        // Role system elements
        primaryRole: "Techie",
        secondaryRole: "Technologist", // Optional
        roleLevel: 2, // Progress within role
        accolades: ["Spring contributor 2025", "Microgrid Fiend"],
        milestones: ["First Light Ceremony", "Seasonal Offering"],
        // Content contributions
        posts: [], // Will be populated from database
      }
    : {
        name:
          userData?.display_name ||
          session?.user?.email?.split("@")[0] ||
          "User",
        username: userData?.username || "username",
        bio: userData?.bio || "No bio yet",
        avatar: userData?.avatar_url
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userData.avatar_url}`
          : "/profiles/default-avatar.jpg",
        // Role system elements
        primaryRole: userData?.primary_role || "Techie",
        secondaryRole: userData?.secondary_role || "Technologist", // Optional
        roleLevel: userData?.role_level || 2, // Progress within role
        accolades: ["Spring contributor 2025", "Microgrid Fiend"],
        milestones: ["First Light Ceremony", "Seasonal Offering"],
        // Content contributions
        posts: [], // Will be populated from database
      };

  // Add this function to handle avatar updates
  function handleAvatarUpdate(url) {
    setAvatarUrl(url);
    // This would trigger a profile refresh or state update
  }

  // Tab content components
  const renderTabContent = () => {
    switch (activeTab) {
      case "contributions":
        return (
          <>
            <h2>My Contributions</h2>
            <div className="profile-posts">
              {userProfile.posts && userProfile.posts.length > 0 ? (
                <div className="contributions-grid">
                  {/* Map through posts when available */}
                </div>
              ) : (
                <p className="placeholder-text">
                  Your contributions will appear here as you create content.
                </p>
              )}
            </div>
          </>
        );
      case "accolades":
        return (
          <>
            <h2>Accolades</h2>
            <div className="accolades-list">
              {userProfile.accolades && userProfile.accolades.length > 0 ? (
                <ul>
                  {userProfile.accolades.map((accolade, index) => (
                    <li key={index} className="accolade-item">
                      <div className="accolade-badge">{accolade.charAt(0)}</div>
                      <span>{accolade}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="placeholder-text">
                  You haven't earned any accolades yet. Participate in community
                  activities to earn recognition!
                </p>
              )}
            </div>
          </>
        );
      case "milestones":
        return (
          <>
            <h2>Milestones</h2>
            <div className="milestones-grid">
              {userProfile.milestones && userProfile.milestones.length > 0 ? (
                <ul>
                  {userProfile.milestones.map((milestone, index) => (
                    <li key={index} className="milestone-item">
                      <div className="milestone-icon">✦</div>
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                // ...placeholder text
                <p className="placeholder-text">
                  Your journey has just begun. As you participate in seasonal
                  events and community gatherings, the marks of your path will
                  be recorded here, creating a living chronicle of your presence
                  within Solcafe.
                </p>
              )}
            </div>
          </>
        );
      case "settings":
        return (
          <>
            <h2>Account Settings</h2>
            <ProfileEditor
              profile={userData}
              userId={session?.user?.id}
              onSave={(updatedProfile) => {
                // update userdata state with new profile info
                setUserData({
                  ...userData,
                  ...updatedProfile,
                });

                alert("Profile updated successfully");
              }}
            />
          </>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <main className="profile-container">
      <section className="profile-header">
        <div className="profile-avatar">
          <Image
            src={
              userData?.avatar_url
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userData.avatar_url}`
                : "/profiles/default-avatar.jpg"
            }
            alt="Profile Avatar"
            width={120}
            height={120}
            style={{ objectFit: "cover" }}
          />
          {/* Role emblem/sigil would appear here */}
          <div className="role-emblem techie">
            {/* Placeholder for role icon */}
          </div>
        </div>

        <div className="profile-info">
          <h1>
            {userProfile.name}
            {userData?.role_id === 4 && (
              <span className="admin-badge">Admin</span>
            )}
          </h1>
          <p className="username">@{userProfile.username}</p>

          {/* Replace the existing role display with RoleBadge */}
          <div className="role-badges">
            <RoleBadge
              role={userProfile.primaryRole}
              level={userProfile.roleLevel}
            />
            {userProfile.secondaryRole && (
              <RoleBadge role={userProfile.secondaryRole} size="small" />
            )}
          </div>

          <p className="bio">{userProfile.bio}</p>
        </div>
      </section>

      <section className="role-journey">
        <h2>Journey Progress</h2>
        <div className="journey-path">
          {/* Placeholder for journey visualization */}
          <div className="journey-node active">Novice</div>
          <div className="journey-line"></div>
          <div className="journey-node">Adept</div>
          <div className="journey-line"></div>
          <div className="journey-node">Master</div>
          <div className="journey-line"></div>
          <div className="journey-node">Exalted</div>
        </div>
      </section>

      <section className="profile-tabs">
        <button
          className={`tab ${activeTab === "contributions" ? "active" : ""}`}
          onClick={() => setActiveTab("contributions")}
        >
          My Contributions
        </button>
        <button
          className={`tab ${activeTab === "accolades" ? "active" : ""}`}
          onClick={() => setActiveTab("accolades")}
        >
          Accolades
        </button>
        <button
          className={`tab ${activeTab === "milestones" ? "active" : ""}`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
        </button>
        <button
          className={`tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Account Settings
        </button>
      </section>

      <section className="profile-content">{renderTabContent()}</section>
    </main>
  );
}
