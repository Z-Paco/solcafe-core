import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract metadata
    const metaTags = document.querySelectorAll("meta");
    let metadata = {
      title: document.querySelector("title")?.textContent || "",
      siteName: "",
      description: "",
      image: "",
    };

    // Process meta tags
    metaTags.forEach((tag) => {
      const property = tag.getAttribute("property") || tag.getAttribute("name");
      const content = tag.getAttribute("content");

      if (property === "og:title" || property === "x:title") {
        metadata.title = content || metadata.title;
      } else if (property === "og:site_name") {
        metadata.siteName = content;
      } else if (
        property === "og:description" ||
        property === "description" ||
        property === "x:description"
      ) {
        metadata.description = content || metadata.description;
      } else if (property === "og:image" || property === "x:image") {
        metadata.image = content || metadata.image;
      }
    });

    // If no site name found, use domain
    if (!metadata.siteName) {
      try {
        const urlObj = new URL(url);
        metadata.siteName = urlObj.hostname.replace("www.", "");
      } catch (e) {
        // Invalid URL format
      }
    }

    // Add this to your relatedLink structure
    const newLink = { title: "", url: "", comment: "", imageUrl: "" };

    // In your related links UI
    <textarea
      placeholder="Your comment about this link"
      value={link.comment}
      onChange={(e) => updateRelatedLink(index, "comment", e.target.value)}
      rows="2"
    />;

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return NextResponse.json(
      { error: "Failed to extract metadata" },
      { status: 500 }
    );
  }
}
