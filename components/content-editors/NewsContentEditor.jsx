"use client";
import { useState } from "react";

export default function NewsContentEditor({ content, updateContent }) {
  const [mainContent, setMainContent] = useState(content.mainContent || "");
  const [sources, setSources] = useState(content.sources || []);
  const [quotes, setQuotes] = useState(content.quotes || []);
  const [relatedLinks, setRelatedLinks] = useState(content.relatedLinks || []);
  const [fetchingMetadata, setFetchingMetadata] = useState(false); // <-- Added state for fetching metadata
  const [coverImage, setCoverImage] = useState(content.coverImage || ""); // <-- Added state for cover image

  // Add validation state
  const [errors, setErrors] = useState({
    mainContent: null,
    sources: {},
    quotes: {},
    relatedLinks: {},
  });

  // Constants for validation
  const MAX_MAIN_CONTENT_LENGTH = 50000;
  const MAX_QUOTE_TEXT_LENGTH = 500;
  const MAX_QUOTE_ATTRIBUTION_LENGTH = 100;
  const MAX_SOURCE_NAME_LENGTH = 100;
  const MAX_SOURCE_URL_LENGTH = 500;
  const MAX_RELATED_LINK_TITLE_LENGTH = 200;
  const MAX_RELATED_LINK_URL_LENGTH = 500;
  const MAX_RELATED_LINK_COMMENT_LENGTH = 1000;

  // New empty source
  const newSource = { name: "", url: "" };

  // New empty quote
  const newQuote = { text: "", attribution: "" };

  // New empty related link
  const newLink = { title: "", url: "" };

  // Add source
  const addSource = () => {
    const updatedSources = [...sources, { ...newSource }];
    setSources(updatedSources);
    updateParent(updatedSources, quotes, relatedLinks);
  };

  // Update source
  const updateSource = (index, field, value) => {
    const updatedSources = [...sources];
    updatedSources[index][field] = value;
    setSources(updatedSources);
    updateParent(updatedSources, quotes, relatedLinks);
  };

  // Remove source
  const removeSource = (index) => {
    const updatedSources = [...sources];
    updatedSources.splice(index, 1);
    setSources(updatedSources);
    updateParent(updatedSources, quotes, relatedLinks);
  };

  // Add quote
  const addQuote = () => {
    const updatedQuotes = [...quotes, { ...newQuote }];
    setQuotes(updatedQuotes);
    updateParent(sources, updatedQuotes, relatedLinks);
  };

  // Update quote
  const updateQuote = (index, field, value) => {
    const updatedQuotes = [...quotes];
    updatedQuotes[index][field] = value;
    setQuotes(updatedQuotes);
    updateParent(sources, updatedQuotes, relatedLinks);
  };

  // Remove quote
  const removeQuote = (index) => {
    const updatedQuotes = [...quotes];
    updatedQuotes.splice(index, 1);
    setQuotes(updatedQuotes);
    updateParent(sources, updatedQuotes, relatedLinks);
  };

  // Add related link
  const addRelatedLink = () => {
    const updatedLinks = [...relatedLinks, { ...newLink }];
    setRelatedLinks(updatedLinks);
    updateParent(sources, quotes, updatedLinks);
  };

  // Update related link
  const updateRelatedLink = (index, field, value) => {
    const updatedLinks = [...relatedLinks];
    updatedLinks[index][field] = value;
    setRelatedLinks(updatedLinks);
    updateParent(sources, quotes, updatedLinks);
  };

  // Remove related link
  const removeRelatedLink = (index) => {
    const updatedLinks = [...relatedLinks];
    updatedLinks.splice(index, 1);
    setRelatedLinks(updatedLinks);
    updateParent(sources, quotes, updatedLinks);
  };

  // Function to extract metadata from URL
  const extractMetadata = async (index, url, type) => {
    if (!url || !url.startsWith("http")) return;

    setFetchingMetadata(true);
    try {
      // Call a serverless function or API route
      const response = await fetch("/api/extract-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (type === "source") {
        // Update source with extracted data
        const updatedSources = [...sources];
        if (!updatedSources[index].name && data.siteName) {
          updatedSources[index].name = data.siteName;
        }
        setSources(updatedSources);
        updateParent(updatedSources, quotes, relatedLinks);
      } else if (type === "relatedLink") {
        // Update related link with extracted data
        const updatedLinks = [...relatedLinks];
        if (!updatedLinks[index].title && data.title) {
          updatedLinks[index].title = data.title;
        }
        if (data.image) {
          updatedLinks[index].imageUrl = data.image;
        }
        setRelatedLinks(updatedLinks);
        updateParent(sources, quotes, updatedLinks);
      }
    } catch (error) {
      console.error("Error extracting metadata:", error);
    } finally {
      setFetchingMetadata(false);
    }
  };

  // Update parent component
  const updateParent = (srcs, qts, links) => {
    updateContent({
      mainContent,
      sources: srcs,
      quotes: qts,
      relatedLinks: links,
    });
  };

  // Update main content
  const handleMainContentChange = (value) => {
    setMainContent(value);

    // Validate length
    if (value.length > MAX_MAIN_CONTENT_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        mainContent: `Content is too long (max ${MAX_MAIN_CONTENT_LENGTH} characters)`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mainContent: null,
      }));
    }

    updateContent({
      mainContent: value,
      sources,
      quotes,
      relatedLinks,
    });
  };

  // Handle cover image change
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        updateContent({
          mainContent,
          sources,
          quotes,
          relatedLinks,
          coverImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add validation method
  const validate = () => {
    const newErrors = {
      mainContent: null,
      sources: {},
      quotes: {},
      relatedLinks: {},
    };

    let isValid = true;

    // Validate main content
    if (mainContent.length > MAX_MAIN_CONTENT_LENGTH) {
      newErrors.mainContent = `Content is too long (max ${MAX_MAIN_CONTENT_LENGTH} characters)`;
      isValid = false;
    }

    // Validate quotes
    quotes.forEach((quote, index) => {
      if (quote.text.length > MAX_QUOTE_TEXT_LENGTH) {
        newErrors.quotes[index] = newErrors.quotes[index] || {};
        newErrors.quotes[
          index
        ].text = `Quote is too long (max ${MAX_QUOTE_TEXT_LENGTH} characters)`;
        isValid = false;
      }
      if (quote.attribution.length > MAX_QUOTE_ATTRIBUTION_LENGTH) {
        newErrors.quotes[index] = newErrors.quotes[index] || {};
        newErrors.quotes[
          index
        ].attribution = `Attribution is too long (max ${MAX_QUOTE_ATTRIBUTION_LENGTH} characters)`;
        isValid = false;
      }
    });

    // Validate sources
    sources.forEach((source, index) => {
      if (source.name.length > MAX_SOURCE_NAME_LENGTH) {
        newErrors.sources[index] = newErrors.sources[index] || {};
        newErrors.sources[
          index
        ].name = `Source name is too long (max ${MAX_SOURCE_NAME_LENGTH} characters)`;
        isValid = false;
      }
      if (source.url.length > MAX_SOURCE_URL_LENGTH) {
        newErrors.sources[index] = newErrors.sources[index] || {};
        newErrors.sources[
          index
        ].url = `URL is too long (max ${MAX_SOURCE_URL_LENGTH} characters)`;
        isValid = false;
      }
    });

    // Validate related links
    relatedLinks.forEach((link, index) => {
      if (link.title.length > MAX_RELATED_LINK_TITLE_LENGTH) {
        newErrors.relatedLinks[index] = newErrors.relatedLinks[index] || {};
        newErrors.relatedLinks[
          index
        ].title = `Title is too long (max ${MAX_RELATED_LINK_TITLE_LENGTH} characters)`;
        isValid = false;
      }
      if (link.url.length > MAX_RELATED_LINK_URL_LENGTH) {
        newErrors.relatedLinks[index] = newErrors.relatedLinks[index] || {};
        newErrors.relatedLinks[
          index
        ].url = `URL is too long (max ${MAX_RELATED_LINK_URL_LENGTH} characters)`;
        isValid = false;
      }
      if (
        link.comment &&
        link.comment.length > MAX_RELATED_LINK_COMMENT_LENGTH
      ) {
        newErrors.relatedLinks[index] = newErrors.relatedLinks[index] || {};
        newErrors.relatedLinks[
          index
        ].comment = `Comment is too long (max ${MAX_RELATED_LINK_COMMENT_LENGTH} characters)`;
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
    <div className="news-content-editor">
      <h2>News Article Details</h2>

      {/* Main article content */}
      <div className="form-group">
        <label htmlFor="news-main-content">Article Content</label>
        <textarea
          id="news-main-content"
          value={mainContent}
          onChange={(e) => handleMainContentChange(e.target.value)}
          placeholder="Write your article content here..."
          rows="10"
          className={errors.mainContent ? "input-error" : ""}
        />
        {errors.mainContent && (
          <div className="field-error">{errors.mainContent}</div>
        )}
        <small>
          {mainContent.length}/{MAX_MAIN_CONTENT_LENGTH} characters
        </small>
      </div>

      {/* Quotes */}
      <div className="form-group">
        <label>Key Quotes</label>
        {quotes.map((quote, index) => (
          <div key={index} className="quote-item">
            <textarea
              placeholder="Quote text"
              value={quote.text}
              onChange={(e) => updateQuote(index, "text", e.target.value)}
              rows="2"
            />
            {errors.quotes[index]?.text && (
              <div className="error-message">{errors.quotes[index].text}</div>
            )}
            <input
              type="text"
              placeholder="Attribution"
              value={quote.attribution}
              onChange={(e) =>
                updateQuote(index, "attribution", e.target.value)
              }
            />
            {errors.quotes[index]?.attribution && (
              <div className="error-message">
                {errors.quotes[index].attribution}
              </div>
            )}
            <button
              type="button"
              onClick={() => removeQuote(index)}
              className="remove-button"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuote} className="secondary-button">
          Add Quote
        </button>
      </div>

      {/* Sources */}
      <div className="form-group">
        <label>Sources</label>
        <p className="field-description">
          Add formal citations for facts or information in your content.
        </p>
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <input
              type="text"
              placeholder="Source name (e.g., CNN, Scientific American)"
              value={source.name}
              onChange={(e) => updateSource(index, "name", e.target.value)}
            />
            {errors.sources[index]?.name && (
              <div className="error-message">{errors.sources[index].name}</div>
            )}
            <input
              type="text"
              placeholder="https://example.com/article-url"
              value={source.url}
              onChange={(e) => updateSource(index, "url", e.target.value)}
            />
            {errors.sources[index]?.url && (
              <div className="error-message">{errors.sources[index].url}</div>
            )}
            <button
              type="button"
              onClick={() => removeSource(index)}
              className="remove-button"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={addSource} className="secondary-button">
          Add Source
        </button>
      </div>

      {/* Related Links */}
      <div className="form-group">
        <label>Related Links</label>
        <p className="field-description">
          Add interesting articles with your commentary. Images will be
          extracted automatically.
        </p>
        {relatedLinks.map((link, index) => (
          <div key={index} className="related-link-item">
            <input
              type="text"
              placeholder="Link title (auto-filled when you fetch info)"
              value={link.title}
              onChange={(e) =>
                updateRelatedLink(index, "title", e.target.value)
              }
            />
            {errors.relatedLinks[index]?.title && (
              <div className="error-message">
                {errors.relatedLinks[index].title}
              </div>
            )}
            <input
              type="text"
              placeholder="https://example.com/related-article"
              value={link.url}
              onChange={(e) => updateRelatedLink(index, "url", e.target.value)}
            />
            {errors.relatedLinks[index]?.url && (
              <div className="error-message">
                {errors.relatedLinks[index].url}
              </div>
            )}
            <textarea
              placeholder="Your thoughts on why this link is relevant"
              value={link.comment || ""}
              onChange={(e) =>
                updateRelatedLink(index, "comment", e.target.value)
              }
              rows="2"
            />
            {errors.relatedLinks[index]?.comment && (
              <div className="error-message">
                {errors.relatedLinks[index].comment}
              </div>
            )}
            <button
              type="button"
              className="fetch-button"
              onClick={() => extractMetadata(index, link.url, "relatedLink")}
              disabled={fetchingMetadata || !link.url}
            >
              {fetchingMetadata ? "Fetching..." : "Fetch Info"}
            </button>

            {link.imageUrl && (
              <div className="link-preview">
                <img
                  src={link.imageUrl}
                  alt={link.title || "Link preview"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/link-placeholder.jpg";
                  }}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => removeRelatedLink(index)}
              className="remove-button"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRelatedLink}
          className="secondary-button"
        >
          Add Related Link
        </button>
      </div>

      {/* Cover Image */}
      <div className="form-group">
        <label htmlFor="coverImage">Cover Image (Optional)</label>
        <p className="field-description">
          Add a cover image if automatic extraction doesn't work or you prefer a
          custom image.
        </p>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          onChange={handleCoverImageChange}
        />
        {coverImage && (
          <div className="image-preview">
            <img src={coverImage} alt="Cover preview" />
          </div>
        )}
      </div>
    </div>
  );
}
