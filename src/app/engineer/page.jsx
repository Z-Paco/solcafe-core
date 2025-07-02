"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import "../styles/engineer.css";

// Project Card component
function ProjectCard({ project }) {
  // Safety check in case project is undefined
  if (!project) return null;

  // Function to safely handle tags that could be in different formats
  const renderTags = (tags) => {
    if (!tags) return null;

    // If tags is already an array
    if (Array.isArray(tags)) {
      return tags.map((tag) => (
        <span className="tag" key={tag.trim()}>
          {tag.trim()}
        </span>
      ));
    }

    // If tags is a string
    if (typeof tags === "string") {
      return tags.split(",").map((tag) => (
        <span className="tag" key={tag.trim()}>
          {tag.trim()}
        </span>
      ));
    }

    // If tags is in another format, convert to string
    return String(tags)
      .split(",")
      .map((tag) => (
        <span className="tag" key={tag.trim()}>
          {tag.trim()}
        </span>
      ));
  };

  return (
    <Link href={`/engineer/${project.slug || ""}`} className="project-link">
      <div className="project-card">
        {project.image_url ? (
          <div className="project-image">
            <img
              src={project.image_url}
              alt={project.title || "Engineering project"}
              onError={(e) => {
                // If image fails to load, replace with placeholder
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.parentNode.classList.add("placeholder-image");
                e.target.parentNode.innerHTML =
                  "<span>Engineering Project</span>";
              }}
            />
          </div>
        ) : (
          <div className="placeholder-image">
            <span>Engineering Project</span>
          </div>
        )}
        <div className="project-content">
          <h3>{project.title || "Untitled Project"}</h3>
          <p>{project.description || "No description available"}</p>
          <div className="project-tags">{renderTags(project.tags)}</div>
          <span className="submitted-by">
            By {project.author_name || "Anonymous"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EngineeringPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProjects() {
      console.log("Fetching engineering projects...");
      try {
        // Use a JOIN with the profiles table
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(
            `
        id, 
        title, 
        description, 
        slug, 
        image_url, 
        tags, 
        created_at, 
        user_id,
        profiles!user_id(username)
      `
          )
          .eq("content_type", "engineering")
          .eq("published", true)
          .order("created_at", { ascending: false });

        console.log("Joined query result:", postsData);

        if (postsError) {
          throw postsError;
        }

        if (!postsData || postsData.length === 0) {
          setProjects([]);
          return;
        }

        // Extract username from the joined data
        const formattedProjects = postsData.map((project) => ({
          ...project,
          author_name: project.profiles?.username || "Anonymous",
        }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching engineering projects:", error.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [supabase]);

  return (
    <main className="engineer-content">
      <h2>Engineering Projects</h2>
      <p>Explore solarpunk engineering, DIY guides, and technical resources.</p>

      <div className="action-bar">
        <Link href="/engineer/create" className="create-button">
          Share Your Project
        </Link>
      </div>

      <section className="featured-projects">
        {loading ? (
          <div className="loading-spinner">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No engineering projects yet. Be the first to share one!</p>
          </div>
        )}
      </section>
    </main>
  );
}
