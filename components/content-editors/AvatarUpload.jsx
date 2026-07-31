"use client";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import NextImage from "next/image"; // Rename to avoid conflict

export default function AvatarUpload({ userId, url, onUpload }) {
  const supabase = useSupabaseClient();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    url || "/profiles/default-avatar.jpg"
  );

  async function compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // Use the global Image constructor, not the imported one
        const img = new window.Image(); // <-- Fix is here
        img.src = event.target.result;

        img.onload = () => {
          // Rest of your compression code is fine
          const canvas = document.createElement("canvas");
          // Target dimensions
          const maxWidth = 400;
          const maxHeight = 400;

          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to Blob
          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.7
          );
        };
      };
    });
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      // Compress the image before uploading
      const originalFile = event.target.files[0];
      console.log("Original file size:", Math.round(originalFile.size / 1024), "KB");
      console.log("User ID for upload:", userId);

      // Compress the image
      const compressedFile = await compressImage(originalFile);
      console.log("Compressed file size:", Math.round(compressedFile.size / 1024), "KB");

      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log("Uploading to path:", filePath);

      // Upload the compressed file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true // Overwrite if exists
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Upload successful:", uploadData);

      // Get the public URL - use this approach
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log("Public URL:", publicUrl);

      // Update profile with new avatar URL
      try {
        const { data: profileData, error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: filePath })
          .eq("id", userId)
          .select();

        if (updateError) {
          console.error("Profile update error:", updateError);
          // Don't throw error here, just log it
          console.warn("Continuing despite profile update error");
        } else {
          console.log("Profile updated:", profileData);
        }
      } catch (profileError) {
        console.error("Profile update exception:", profileError);
        // Don't throw this error either, just log it
      }

      // Update local state anyway
      setAvatarUrl(publicUrl);
      
      // Notify parent component
      if (onUpload) {
        onUpload(filePath);
      }
      
    } catch (error) {
      console.error("Error in upload process:", error);
      alert(error.message || "Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        <NextImage // Use the renamed import
          src={avatarUrl}
          alt="Avatar"
          width={150}
          height={150}
          className="avatar-image"
        />
      </div>
      <div className="avatar-upload-controls">
        <label className="upload-button" htmlFor="single">
          {uploading ? "Uploading..." : "Upload Avatar"}
        </label>
        <input
          style={{ visibility: "hidden", position: "absolute" }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
