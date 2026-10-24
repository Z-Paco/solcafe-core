import React from "react";
import Link from "next/link";
import Chronicle from "./Chronicle";
import CopySlot from "./CopySlot";
import Lancet from "./Lancet";
import SectionHead from "./SectionHead";
import HeroWindow from "../glass/HeroWindow";
import LightBeams from "../glass/LightBeams";
import Motes from "../glass/Motes";
import RoseWindow from "../glass/RoseWindow";
import { listPublished } from "@/lib/posts";
import "../../app/styles/home.css";
import "../../app/styles/collections.css";

export default async function HomePage() {
  const [news, art, engineering] = await Promise.all([
    listPublished("news", 3),
    listPublished("art", 1),
    listPublished("engineering", 1),
  ]);

  return (
    <main id="main-content" className="home">
      {/* The nave: a window of light falling across the stone onto the words */}
      <section className="nave" aria-labelledby="home-title">
        <LightBeams className="nave__beams" />
        <Motes className="nave__motes" />
        <div className="nave__inner container">
          <div className="nave__text">
            <p className="inscr nave__eyebrow">News · Art · Engineering</p>
            <CopySlot
              id="home.mission"
              as="h1"
              size="display"
              label="Headline · your words"
              ghost="Your headline"
              fallback="SolCafe"
              htmlId="home-title"
              className="nave__title"
              lines={2}
            />
            <CopySlot
              id="home.lede"
              as="p"
              size="lede"
              label="A sentence or two"
              ghost="your opening sentence"
              className="nave__lede"
              lines={3}
            />
            <div className="nave__actions">
              <Link href="/news" className="btn btn--primary">
                Read the news
              </Link>
              <Link href="/about" className="btn btn--secondary">
                About SolCafe
              </Link>
            </div>
          </div>
          <div className="nave__window">
            <span className="nave__halo" aria-hidden="true" />
            <HeroWindow className="nave__glass" />
          </div>
        </div>
      </section>

      <section className="home-section container" aria-labelledby="home-news-heading">
        <SectionHead id="home-news-heading" title="Latest news" href="/news" linkLabel="All news" />
        <Chronicle posts={news.posts} error={news.error} />
      </section>

      <section className="home-section container" aria-labelledby="home-works-heading">
        <SectionHead id="home-works-heading" title="Art & engineering" />
        <div className="lancets">
          <RoseWindow variant="oculus" className="lancets__oculus" />
          <Lancet post={art.posts[0]} type="art" emptySlot="art.empty" />
          <Lancet post={engineering.posts[0]} type="engineering" emptySlot="engineer.empty" />
        </div>
      </section>

      {/* The canticle: the lens, under the great rose */}
      <section className="canticle" aria-labelledby="home-lens-heading">
        <div className="canticle__inner container">
          <RoseWindow variant="big" className="canticle__rose" />
          <div className="canticle__text">
            <p className="inscr canticle__eyebrow">The lens</p>
            <CopySlot
              id="home.lens.heading"
              as="h2"
              size="heading"
              label="Heading"
              ghost="Your heading"
              fallback="The lens"
              htmlId="home-lens-heading"
            />
            <CopySlot id="home.lens.body" as="p" size="lede" label="A few sentences" lines={4} />
            <figure className="canticle__epigraph">
              <CopySlot
                id="home.lens.epigraph"
                as="blockquote"
                size="lede"
                label="Epigraph, cited"
                className="accent-italic"
                lines={2}
              />
              <figcaption>
                <CopySlot id="home.lens.epigraphSource" as="span" size="small" label="Source" />
              </figcaption>
            </figure>
            <div>
              <Link href="/about" className="btn btn--primary canticle__btn">
                About SolCafe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
