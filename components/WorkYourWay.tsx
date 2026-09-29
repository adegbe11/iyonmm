import Link from "next/link";
import "./work-your-way.css";

function Page({ className = "" }: { className?: string }) {
  return <div className={`workflow-page ${className}`}><div className="page-block" /><div className="page-rule" /><div className="page-rule" /><div className="page-rule short" /><div className="page-block" /><div className="page-rule" /><div className="page-rule short" /></div>;
}

function Plant() {
  return <svg viewBox="0 0 120 160" aria-hidden="true" className="workflow-plant"><path d="M59 111V44" stroke="#3f6c47" strokeWidth="4" /><path d="M59 69C18 75 16 30 25 20c31 0 43 21 34 49Z" fill="#68986d" /><path d="M60 86c38 5 49-27 40-44-27-1-43 17-40 44Z" fill="#3d7652" /><path d="M59 51c-21-18-14-38 0-47 22 12 21 33 0 47Z" fill="#84ad75" /><path d="M59 105C23 115 18 89 23 74c28-5 40 13 36 31Z" fill="#4c8056" /><path d="M35 110h50l-7 43H42Z" fill="#d99770" /><path d="M35 110h50v9H35Z" fill="#edb18b" /><path d="M43 119h8l5 34H42Z" fill="#e8aa84" opacity=".65" /></svg>;
}

const cards = [
  { kind: "documents", href: "/merge-pdf", title: "Documents.", description: "Merge, organise, and prepare your PDFs to share." },
  { kind: "images", href: "/remove-background", title: "Images.", description: "Remove backgrounds and make every photo ready." },
  { kind: "video", href: "/compress-video", title: "Videos.", description: "Make your videos smaller and easier to send." },
];

export default function WorkYourWay() {
  return <section className="work-your-way" aria-labelledby="workflow-heading">
    <div className="workflow-container">
      <div className="workflow-heading"><h2 id="workflow-heading">Make everyday work easier.</h2></div>
      <div className="workflow-grid">
        {cards.map((card) => <Link href={card.href} key={card.kind} className={`workflow-card workflow-${card.kind}`}>
          <div className="workflow-visual" aria-hidden="true">
            {card.kind === "documents" && <div className="document-scene"><Page className="page-back" /><Page className="page-front" /></div>}
            {card.kind === "images" && <div className="image-scene"><div className="photo-before"><Plant /></div><div className="photo-after"><Plant /></div></div>}
            {card.kind === "video" && <div className="video-scene"><div className="video-preview"><div className="video-sun" /><div className="video-hill hill-back" /><div className="video-hill hill-front" /><span className="video-play">▶</span></div></div>}
          </div>
          <div className="workflow-copy"><h3>{card.title}</h3><p>{card.description}</p><span className="workflow-arrow" aria-hidden="true">↗</span></div>
        </Link>)}
      </div>
    </div>
  </section>;
}
