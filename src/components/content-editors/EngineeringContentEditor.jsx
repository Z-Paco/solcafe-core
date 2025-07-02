"use client";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function EngineeringContentEditor({
  content,
  updateContent,
  userId,
}) {
  const supabase = useSupabaseClient();

  // State for engineering-specific content
  const [overview, setOverview] = useState(content.overview || "");
  const [difficulty, setDifficulty] = useState(
    content.difficulty || "intermediate"
  );
  const [timeRequired, setTimeRequired] = useState(content.timeRequired || "");
  const [materials, setMaterials] = useState(content.materials || []);
  const [steps, setSteps] = useState(content.steps || []);
  const [codeSnippets, setCodeSnippets] = useState(content.codeSnippets || []);
  const [schematics, setSchematics] = useState(content.schematics || []);

  // Upload state
  const [uploadingSchematics, setUploadingSchematics] = useState(false);

  // Add validation state
  const [errors, setErrors] = useState({
    overview: null,
    timeRequired: null,
    materials: {},
    steps: {},
    codeSnippets: {},
    schematicCaptions: {},
  });

  // Constants for validation
  const MAX_OVERVIEW_LENGTH = 3000;
  const MAX_TIME_REQUIRED_LENGTH = 50;
  const MAX_MATERIAL_NAME_LENGTH = 100;
  const MAX_MATERIAL_QUANTITY_LENGTH = 20;
  const MAX_MATERIAL_UNIT_LENGTH = 20;
  const MAX_STEP_TITLE_LENGTH = 100;
  const MAX_STEP_DESCRIPTION_LENGTH = 2000;
  const MAX_CODE_DESCRIPTION_LENGTH = 200;
  const MAX_CODE_SNIPPET_LENGTH = 5000;
  const MAX_SCHEMATIC_CAPTION_LENGTH = 150;

  // Language-specific limits
  const CODE_LIMITS = {
    javascript: 5000,
    python: 4000,
    java: 7000,
    c: 6000,
    html: 8000,
    css: 6000,
    shell: 3000,
    other: 5000,
  };

  // Initialize with default empty items if none exist
  useEffect(() => {
    if (materials.length === 0) {
      setMaterials([{ name: "", quantity: "", unit: "" }]);
    }
    if (steps.length === 0) {
      setSteps([{ title: "", description: "", imageUrl: "" }]);
    }
  }, []);

  // Materials list functions
  const addMaterial = () => {
    const updatedMaterials = [
      ...materials,
      { name: "", quantity: "", unit: "" },
    ];
    setMaterials(updatedMaterials);
    updateParentContent(updatedMaterials, steps, codeSnippets, schematics);
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
    updateParentContent(updatedMaterials, steps, codeSnippets, schematics);
  };

  const removeMaterial = (index) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
    updateParentContent(updatedMaterials, steps, codeSnippets, schematics);
  };

  // Steps functions
  const addStep = () => {
    const updatedSteps = [
      ...steps,
      { title: "", description: "", imageUrl: "" },
    ];
    setSteps(updatedSteps);
    updateParentContent(materials, updatedSteps, codeSnippets, schematics);
  };

  const updateStep = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
    updateParentContent(materials, updatedSteps, codeSnippets, schematics);
  };

  const removeStep = (index) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
    updateParentContent(materials, updatedSteps, codeSnippets, schematics);
  };

  // Code snippet functions
  const addCodeSnippet = () => {
    const updatedSnippets = [
      ...codeSnippets,
      { language: "javascript", code: "", description: "" },
    ];
    setCodeSnippets(updatedSnippets);
    updateParentContent(materials, steps, updatedSnippets, schematics);
  };

  const updateCodeSnippet = (index, field, value) => {
    const updatedSnippets = [...codeSnippets];
    updatedSnippets[index][field] = value;
    setCodeSnippets(updatedSnippets);
    updateParentContent(materials, steps, updatedSnippets, schematics);
  };

  const removeCodeSnippet = (index) => {
    const updatedSnippets = [...codeSnippets];
    updatedSnippets.splice(index, 1);
    setCodeSnippets(updatedSnippets);
    updateParentContent(materials, steps, updatedSnippets, schematics);
  };

  // Handle schematic/diagram uploads (similar to image upload in Art)
  const handleSchematicUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingSchematics(true);

    try {
      const newSchematics = [...schematics];

      for (const file of e.target.files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `schematic-${Date.now()}-${Math.random()
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

        newSchematics.push({
          url: data.publicUrl,
          path: filePath,
          caption: "",
        });
      }

      setSchematics(newSchematics);
      updateParentContent(materials, steps, codeSnippets, newSchematics);
    } catch (error) {
      console.error("Error uploading schematics:", error);
      alert("Error uploading schematics. Please try again.");
    } finally {
      setUploadingSchematics(false);
    }
  };

  // Update schematic caption
  const updateSchematicCaption = (index, caption) => {
    const updatedSchematics = [...schematics];
    updatedSchematics[index].caption = caption;
    setSchematics(updatedSchematics);
    updateParentContent(materials, steps, codeSnippets, updatedSchematics);
  };

  // Remove schematic
  const removeSchematic = (index) => {
    const updatedSchematics = [...schematics];
    updatedSchematics.splice(index, 1);
    setSchematics(updatedSchematics);
    updateParentContent(materials, steps, codeSnippets, updatedSchematics);
  };

  // Update metadata fields
  const handleMetadataChange = (field, value) => {
    if (field === "overview") setOverview(value);
    if (field === "difficulty") setDifficulty(value);
    if (field === "timeRequired") setTimeRequired(value);

    updateContent({
      overview: field === "overview" ? value : overview,
      difficulty: field === "difficulty" ? value : difficulty,
      timeRequired: field === "timeRequired" ? value : timeRequired,
      materials,
      steps,
      codeSnippets,
      schematics,
    });
  };

  // Helper to update parent component's state
  const updateParentContent = (mats, stps, codes, schems) => {
    updateContent({
      overview,
      difficulty,
      timeRequired,
      materials: mats,
      steps: stps,
      codeSnippets: codes,
      schematics: schems,
    });
  };

  // Add this validation method
  const validate = () => {
    const newErrors = {
      overview: null,
      timeRequired: null,
      materials: {},
      steps: {},
      codeSnippets: {},
      schematicCaptions: {},
    };

    let isValid = true;

    // Validate overview
    if (overview.length > MAX_OVERVIEW_LENGTH) {
      newErrors.overview = `Overview is too long (max ${MAX_OVERVIEW_LENGTH} characters)`;
      isValid = false;
    }

    // Validate time required
    if (timeRequired.length > MAX_TIME_REQUIRED_LENGTH) {
      newErrors.timeRequired = `Time required is too long (max ${MAX_TIME_REQUIRED_LENGTH} characters)`;
      isValid = false;
    }

    // Validate materials
    materials.forEach((material, index) => {
      if (material.name.length > MAX_MATERIAL_NAME_LENGTH) {
        newErrors.materials[index] = newErrors.materials[index] || {};
        newErrors.materials[
          index
        ].name = `Material name is too long (max ${MAX_MATERIAL_NAME_LENGTH} characters)`;
        isValid = false;
      }
      if (material.quantity.length > MAX_MATERIAL_QUANTITY_LENGTH) {
        newErrors.materials[index] = newErrors.materials[index] || {};
        newErrors.materials[
          index
        ].quantity = `Quantity is too long (max ${MAX_MATERIAL_QUANTITY_LENGTH} characters)`;
        isValid = false;
      }
      if (material.unit.length > MAX_MATERIAL_UNIT_LENGTH) {
        newErrors.materials[index] = newErrors.materials[index] || {};
        newErrors.materials[
          index
        ].unit = `Unit is too long (max ${MAX_MATERIAL_UNIT_LENGTH} characters)`;
        isValid = false;
      }
    });

    // Validate steps
    steps.forEach((step, index) => {
      if (step.title.length > MAX_STEP_TITLE_LENGTH) {
        newErrors.steps[index] = newErrors.steps[index] || {};
        newErrors.steps[
          index
        ].title = `Step title is too long (max ${MAX_STEP_TITLE_LENGTH} characters)`;
        isValid = false;
      }
      if (step.description.length > MAX_STEP_DESCRIPTION_LENGTH) {
        newErrors.steps[index] = newErrors.steps[index] || {};
        newErrors.steps[
          index
        ].description = `Step description is too long (max ${MAX_STEP_DESCRIPTION_LENGTH} characters)`;
        isValid = false;
      }
    });

    // Validate code snippets
    codeSnippets.forEach((snippet, index) => {
      if (snippet.description.length > MAX_CODE_DESCRIPTION_LENGTH) {
        newErrors.codeSnippets[index] = newErrors.codeSnippets[index] || {};
        newErrors.codeSnippets[
          index
        ].description = `Code description is too long (max ${MAX_CODE_DESCRIPTION_LENGTH} characters)`;
        isValid = false;
      }
      if (
        snippet.code.length >
        (CODE_LIMITS[snippet.language] || MAX_CODE_SNIPPET_LENGTH)
      ) {
        newErrors.codeSnippets[index] = newErrors.codeSnippets[index] || {};
        newErrors.codeSnippets[index].code = `Code is too long (max ${
          CODE_LIMITS[snippet.language] || MAX_CODE_SNIPPET_LENGTH
        } characters)`;
        isValid = false;
      }
    });

    // Validate schematic captions
    schematics.forEach((schematic, index) => {
      if (
        schematic.caption &&
        schematic.caption.length > MAX_SCHEMATIC_CAPTION_LENGTH
      ) {
        newErrors.schematicCaptions[
          index
        ] = `Caption is too long (max ${MAX_SCHEMATIC_CAPTION_LENGTH} characters)`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Attach validate method to updateContent
  if (typeof updateContent === "function") {
    updateContent.validate = validate;
  }

  return (
    <div className="engineering-content-editor">
      <h2>Engineering Project Details</h2>

      {/* Project Overview */}
      <div className="form-group">
        <label htmlFor="project-overview">Project Overview</label>
        <textarea
          id="project-overview"
          value={overview}
          onChange={(e) => handleMetadataChange("overview", e.target.value)}
          placeholder="Describe your project, its purpose, and key features"
          rows="4"
          className={errors.overview ? "input-error" : ""}
        />
        {errors.overview && (
          <div className="field-error">{errors.overview}</div>
        )}
        <small>
          {overview.length}/{MAX_OVERVIEW_LENGTH} characters
        </small>
      </div>

      {/* Project Metadata */}
      <div className="metadata-grid">
        <div className="form-group">
          <label htmlFor="project-difficulty">Difficulty Level</label>
          <select
            id="project-difficulty"
            value={difficulty}
            onChange={(e) => handleMetadataChange("difficulty", e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="project-time">Time Required</label>
          <input
            type="text"
            id="project-time"
            value={timeRequired}
            onChange={(e) =>
              handleMetadataChange("timeRequired", e.target.value)
            }
            placeholder="e.g., 2 hours, 1 week"
            className={errors.timeRequired ? "input-error" : ""}
          />
          {errors.timeRequired && (
            <div className="field-error">{errors.timeRequired}</div>
          )}
          <small>
            {timeRequired.length}/{MAX_TIME_REQUIRED_LENGTH} characters
          </small>
        </div>
      </div>

      {/* Materials List */}
      <div className="form-group">
        <label>Materials Required</label>
        <div className="materials-list">
          {materials.map((material, index) => (
            <div key={index} className="material-item">
              <div className="material-inputs">
                <input
                  type="text"
                  placeholder="Material name"
                  value={material.name}
                  onChange={(e) =>
                    updateMaterial(index, "name", e.target.value)
                  }
                />
                <div className="quantity-unit">
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={material.quantity}
                    onChange={(e) =>
                      updateMaterial(index, "quantity", e.target.value)
                    }
                    className="quantity-input"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={material.unit}
                    onChange={(e) =>
                      updateMaterial(index, "unit", e.target.value)
                    }
                    className="unit-input"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="remove-button"
                disabled={materials.length === 1}
              >
                ×
              </button>
              {errors.materials[index] && (
                <div className="error-messages">
                  {errors.materials[index].name && (
                    <p className="error-message">
                      {errors.materials[index].name}
                    </p>
                  )}
                  {errors.materials[index].quantity && (
                    <p className="error-message">
                      {errors.materials[index].quantity}
                    </p>
                  )}
                  {errors.materials[index].unit && (
                    <p className="error-message">
                      {errors.materials[index].unit}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMaterial}
            className="secondary-button"
          >
            Add Material
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="form-group">
        <label>Build Steps</label>
        {steps.map((step, index) => (
          <div key={index} className="step-editor">
            <div className="step-header">
              <h4>Step {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="remove-button"
                disabled={steps.length === 1}
              >
                ×
              </button>
            </div>
            {/* Step title input */}
            <input
              type="text"
              value={step.title || ""}
              onChange={(e) => updateStep(index, "title", e.target.value)}
              placeholder="Step Title"
              className={errors.steps[index]?.title ? "input-error" : ""}
            />
            {errors.steps[index]?.title && (
              <div className="field-error">{errors.steps[index].title}</div>
            )}
            <small>
              {(step.title || "").length}/{MAX_STEP_TITLE_LENGTH} characters
            </small>

            {/* Step description input */}
            <textarea
              value={step.description || ""}
              onChange={(e) => updateStep(index, "description", e.target.value)}
              placeholder="Step instructions"
              rows="3"
              className={errors.steps[index]?.description ? "input-error" : ""}
            />
            {errors.steps[index]?.description && (
              <div className="field-error">
                {errors.steps[index].description}
              </div>
            )}
            <small>
              {(step.description || "").length}/{MAX_STEP_DESCRIPTION_LENGTH}{" "}
              characters
            </small>

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={step.imageUrl}
              onChange={(e) => updateStep(index, "imageUrl", e.target.value)}
            />
            {step.imageUrl && (
              <div className="step-image-preview">
                <img src={step.imageUrl} alt={`Step ${index + 1}`} />
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addStep} className="secondary-button">
          Add Step
        </button>
      </div>

      {/* Code Snippets */}
      <div className="form-group">
        <label>Code Snippets</label>
        {codeSnippets.map((snippet, index) => (
          <div key={index} className="code-snippet-editor">
            <div className="snippet-header">
              <select
                value={snippet.language}
                onChange={(e) =>
                  updateCodeSnippet(index, "language", e.target.value)
                }
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C/C++</option>
                <option value="java">Java</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="shell">Shell/Bash</option>
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                onClick={() => removeCodeSnippet(index)}
                className="remove-button"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder="Description"
              value={snippet.description}
              onChange={(e) =>
                updateCodeSnippet(index, "description", e.target.value)
              }
              className={`snippet-description ${
                errors.codeSnippets[index]?.description ? "input-error" : ""
              }`}
            />
            {errors.codeSnippets[index]?.description && (
              <div className="field-error">
                {errors.codeSnippets[index].description}
              </div>
            )}
            <small>
              {snippet.description.length}/{MAX_CODE_DESCRIPTION_LENGTH}{" "}
              characters
            </small>
            <textarea
              className={`code-block-editor language-${snippet.language} ${
                errors.codeSnippets[index]?.code ? "input-error" : ""
              }`}
              value={snippet.code}
              onChange={(e) => updateCodeSnippet(index, "code", e.target.value)}
              rows="5"
              placeholder={getLanguagePlaceholder(snippet.language)}
            />
            {errors.codeSnippets[index]?.code && (
              <div className="field-error">
                {errors.codeSnippets[index].code}
              </div>
            )}
            <small>
              {snippet.code.length}/{MAX_CODE_SNIPPET_LENGTH} characters
            </small>
          </div>
        ))}
        <button
          type="button"
          onClick={addCodeSnippet}
          className="secondary-button"
        >
          Add Code Snippet
        </button>
      </div>

      {/* Schematics/Diagrams */}
      <div className="form-group">
        <label htmlFor="schematics">Schematics/Diagrams</label>
        <input
          type="file"
          id="schematics"
          multiple
          accept="image/*"
          onChange={handleSchematicUpload}
          disabled={uploadingSchematics}
        />
        <small>Upload diagrams, schematics, or technical drawings</small>

        {uploadingSchematics && <p>Uploading files...</p>}

        {schematics.length > 0 && (
          <div className="multi-image-gallery">
            {schematics.map((schematic, index) => (
              <div key={index} className="gallery-image">
                <img src={schematic.url} alt={`Schematic ${index + 1}`} />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeSchematic(index)}
                >
                  ×
                </button>
                <input
                  type="text"
                  placeholder="Add caption"
                  value={schematic.caption || ""}
                  onChange={(e) =>
                    updateSchematicCaption(index, e.target.value)
                  }
                  className="image-caption"
                />
                {errors.schematicCaptions[index] && (
                  <p className="error-message">
                    {errors.schematicCaptions[index]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for placeholders
const getLanguagePlaceholder = (language) => {
  switch (language) {
    case "javascript":
      return "// Your JavaScript code here";
    case "python":
      return "# Your Python code here";
    case "html":
      return "<!-- Your HTML code here -->";
    case "css":
      return "/* Your CSS code here */";
    default:
      return "// Your code here";
  }
};
