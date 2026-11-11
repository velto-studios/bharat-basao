import Experience from "@/components/Experience";

const STEPS = [
  { n: "1", title: "Follow karo", body: "Instagram par @velto_studios. Ghar sirf followers ke bante hain." },
  { n: "2", title: "Ek comment", body: "Latest Reel par apna shehar aur naam. Ek hi comment kaafi hai, baar baar likhne ki zaroorat nahi." },
  { n: "3", title: "Agla episode", body: "Chiku comments padhkar ghar aur sabse zyada maangi jagah banata hai. Naam ke saath." },
];

const RULES = [
  "Sabka swagat hai. Kisi desh, dharm, jaati ya insaan ke khilaf comment hataye jayenge.",
  "Ghar par sirf wahi naam jo aapne khud likha. Kisi aur ka naam ya handle nahi.",
  "Yeh ek game aur kahani hai. Naksha kalpana hai, kisi sarkari seema ka daava nahi.",
];

export default function Page() {
  return (
    <>
      <Experience />
      <section id="kaise" className="section kaise">
        <div className="section-head">
          <p className="eyebrow">Kaise khele</p>
          <h2>Teen kadam, ek ghar</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="step-n" aria-hidden="true">
                {s.n}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="rules">
          <h3>Gaon ke niyam</h3>
          <ul>
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="cta-band">
          <div>
            <h2>Naksha khaali hai. Pehla ghar kiska hoga?</h2>
            <p>Reel par apna shehar likho. Kal ki gali mein aapka naam ho sakta hai.</p>
          </div>
          <a className="btn btn-big btn-light" href="https://www.instagram.com/velto_studios/" target="_blank" rel="noopener noreferrer">
            @velto_studios kholo
          </a>
        </div>
      </section>
      <footer className="footer">
        <div>
          <strong>Bharat Basao</strong> · ek Velto Studios project
          <p className="muted">Saari art, Chiku Mistri aur code Velto Studios ke original hain. Naqshe ki rekhaayein Natural Earth (public domain) se.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#naksha">Naksha</a>
          <a href="#basao">Ghar basao</a>
          <a href="https://www.instagram.com/velto_studios/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </nav>
        <p className="muted small">© 2026 Velto Studios</p>
      </footer>
    </>
  );
}
