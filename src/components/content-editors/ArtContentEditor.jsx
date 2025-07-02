"use client";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ArtContentEditor({ content, updateContent, userId }) {
  const supabase = useSupabaseClient();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState(content.images || []);
  const [medium, setMedium] = useState(content.medium || "");
  const [collaborators, setCollaborators] = useState(
    content.collaborators || ""
  );

  // Add validation errors state
  const [errors, setErrors] = useState({
    medium: null,
    collaborators: null,
    captions: {},
  });

  // Constants for validation
  const MAX_MEDIUM_LENGTH = 100;
  const MAX_COLLABORATORS_LENGTH = 200;
  const MAX_CAPTION_LENGTH = 150;

  // Handle image uploads
  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImages(true);

    try {
      const newImages = [...images];

      for (const file of e.target.files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `art-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        newImages.push({
          url: data.publicUrl,
          path: filePath,
          caption: "",
        });
      }

      setImages(newImages);

      // Update parent component
      updateContent({
        images: newImages,
        medium,
        collaborators,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  // Update metadata with validation
  const handleMetadataChange = (field, value) => {
    const newErrors = { ...errors };

    if (field === "medium") {
      setMedium(value);

      // Validate medium
      if (value.length > MAX_MEDIUM_LENGTH) {
        newErrors.medium = `Medium description is too long (max ${MAX_MEDIUM_LENGTH} characters)`;
      } else {
        newErrors.medium = null;
      }
    }

    if (field === "collaborators") {
      setCollaborators(value);

      // Validate collaborators
      if (value.length > MAX_COLLABORATORS_LENGTH) {
        newErrors.collaborators = `Collaborators list is too long (max ${MAX_COLLABORATORS_LENGTH} characters)`;
      } else {
        newErrors.collaborators = null;
      }
    }

    setErrors(newErrors);

    // Still update the content even if there are errors
    updateContent({
      images,
      medium: field === "medium" ? value : medium,
      collaborators: field === "collaborators" ? value : collaborators,
    });
  };

  // Update image caption with validation
  const updateCaption = (index, caption) => {
    const updatedImages = [...images];
    updatedImages[index].caption = caption;
    setImages(updatedImages);

    // Validate caption length
    const newErrors = { ...errors };
    if (caption.length > MAX_CAPTION_LENGTH) {
      newErrors.captions[
        index
      ] = `Caption is too long (max ${MAX_CAPTION_LENGTH} characters)`;
    } else {
      // Remove error if it exists and is now fixed
      if (newErrors.captions[index]) {
        delete newErrors.captions[index];
      }
    }
    setErrors(newErrors);

    // Still update content even with errors
    updateContent({
      images: updatedImages,
      medium,
      collaborators,
    });
  };

  // Add validation check method that parent can call
  const validate = () => {
    const newErrors = {
      medium: null,
      collaborators: null,
      captions: {},
    };

    let isValid = true;

    // Check medium
    if (medium.length > MAX_MEDIUM_LENGTH) {
      newErrors.medium = `Medium description is too long (max ${MAX_MEDIUM_LENGTH} characters)`;
      isValid = false;
    }

    // Check collaborators
    if (collaborators.length > MAX_COLLABORATORS_LENGTH) {
      newErrors.collaborators = `Collaborators list is too long (max ${MAX_COLLABORATORS_LENGTH} characters)`;
      isValid = false;
    }

    // Check all captions
    images.forEach((image, index) => {
      if (image.caption && image.caption.length > MAX_CAPTION_LENGTH) {
        newErrors.captions[
          index
        ] = `Caption is too long (max ${MAX_CAPTION_LENGTH} characters)`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Expose validation method to parent
  if (typeof updateContent === "function") {
    // Attach validate method to the updateContent function
    updateContent.validate = validate;
  }

  // Add this function inside your component, before the return statement:
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateContent({
      images: newImages,
      medium,
      collaborators,
    });
  };

  return (
    <div className="art-content-editor">
      <h2>Art Details</h2>

      {/* Image Upload Section */}
      <div className="form-group image-upload-section">
        <label htmlFor="art-images">Upload Images *</label>
        <input
          type="file"
          id="art-images"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImages}
        />
        <small>Select multiple images to upload a gallery</small>

        {uploadingImages && <p>Uploading images...</p>}

        {images.length > 0 && (
          <div className="multi-image-gallery">
            {images.map((image, index) => (
              <div key={index} className="gallery-image">
                <img src={image.url} alt={`Gallery image ${index + 1}`} />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
                <div className="caption-container">
                  <input
                    type="text"
                    placeholder="Add caption"
                    value={image.caption || ""}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    className={
                      errors.captions[index]
                        ? "image-caption input-error"
                        : "image-caption"
                    }
                  />
                  {errors.captions[index] && (
                    <div className="field-error">{errors.captions[index]}</div>
                  )}
                  <small>
                    {(image.caption || "").length}/{MAX_CAPTION_LENGTH}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Art Metadata */}
      <div className="form-group">
        <label htmlFor="art-medium">Medium</label>
        <input
          type="text"
          id="art-medium"
          value={medium}
          onChange={(e) => handleMetadataChange("medium", e.target.value)}
          placeholder="e.g., Oil on canvas, Digital, Mixed media"
          className={errors.medium ? "input-error" : ""}
        />
        {errors.medium && <div className="field-error">{errors.medium}</div>}
        <small>
          {medium.length}/{MAX_MEDIUM_LENGTH}
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="art-collaborators">Collaborators</label>
        <input
          type="text"
          id="art-collaborators"
          value={collaborators}
          onChange={(e) =>
            handleMetadataChange("collaborators", e.target.value)
          }
          placeholder="Other artists who contributed to this work"
          className={errors.collaborators ? "input-error" : ""}
        />
        {errors.collaborators && (
          <div className="field-error">{errors.collaborators}</div>
        )}
        <small>
          {collaborators.length}/{MAX_COLLABORATORS_LENGTH}
        </small>
      </div>
    </div>
  );
}
