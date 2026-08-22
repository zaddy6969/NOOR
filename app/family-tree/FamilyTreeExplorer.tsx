"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Person = { id: string; name: string; relation: string; note: string; group: "ancestors" | "household" | "children" | "descendants"; honorific?: string };

const people: Person[] = [
  { id: "abdul-muttalib", name: "‘Abd al-Muttalib", relation: "Paternal grandfather", group: "ancestors", note: "A leading elder of Banu Hashim and the paternal grandfather of Prophet Muhammad ﷺ." },
  { id: "abdullah", name: "‘Abdullah ibn ‘Abd al-Muttalib", relation: "Father", group: "ancestors", note: "The father of Prophet Muhammad ﷺ. He passed away before the Prophet’s birth." },
  { id: "aminah", name: "Aminah bint Wahb", relation: "Mother", group: "ancestors", note: "The mother of Prophet Muhammad ﷺ, from Banu Zuhrah of Quraysh." },
  { id: "prophet", name: "Prophet Muhammad", honorific: "ﷺ", relation: "The final Messenger", group: "household", note: "Muhammad ibn ‘Abdullah ﷺ, the final Prophet and Messenger of Allah. No portrait or imagined depiction is used." },
  { id: "khadijah", name: "Khadijah bint Khuwaylid", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "The Prophet’s first wife, the first believer, and mother of six of his children according to the well-known account." },
  { id: "sawdah", name: "Sawdah bint Zam‘ah", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "One of the Mothers of the Believers." },
  { id: "aishah", name: "‘Aishah bint Abi Bakr", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "A Mother of the Believers and an important transmitter of hadith and knowledge." },
  { id: "hafsah", name: "Hafsah bint ‘Umar", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "A Mother of the Believers and daughter of ‘Umar ibn al-Khattab." },
  { id: "zaynab-k", name: "Zaynab bint Khuzaymah", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "Known in the sources for generosity to the poor." },
  { id: "umm-salamah", name: "Umm Salamah", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "A Mother of the Believers known for wisdom and hadith transmission." },
  { id: "zaynab-j", name: "Zaynab bint Jahsh", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "A Mother of the Believers noted for worship and charity." },
  { id: "juwayriyah", name: "Juwayriyah bint al-Harith", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "One of the Mothers of the Believers." },
  { id: "umm-habibah", name: "Umm Habibah", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "A Mother of the Believers and daughter of Abu Sufyan." },
  { id: "safiyyah", name: "Safiyyah bint Huyayy", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "One of the Mothers of the Believers." },
  { id: "maymunah", name: "Maymunah bint al-Harith", honorific: "رضي الله عنها", relation: "Wife · Mother of the Believers", group: "household", note: "One of the Mothers of the Believers." },
  { id: "qasim", name: "Al-Qasim", relation: "Son", group: "children", note: "A son of Prophet Muhammad ﷺ and Khadijah رضي الله عنها who died in childhood." },
  { id: "zaynab", name: "Zaynab", honorific: "رضي الله عنها", relation: "Daughter", group: "children", note: "The eldest daughter in the commonly presented ordering." },
  { id: "ruqayyah", name: "Ruqayyah", honorific: "رضي الله عنها", relation: "Daughter", group: "children", note: "A daughter of the Prophet ﷺ and wife of ‘Uthman ibn ‘Affan رضي الله عنه." },
  { id: "umm-kulthum", name: "Umm Kulthum", honorific: "رضي الله عنها", relation: "Daughter", group: "children", note: "A daughter of the Prophet ﷺ who later married ‘Uthman ibn ‘Affan رضي الله عنه." },
  { id: "fatimah", name: "Fatimah al-Zahra", honorific: "رضي الله عنها", relation: "Daughter", group: "children", note: "The beloved daughter of the Prophet ﷺ, wife of ‘Ali رضي الله عنه and mother of Hasan and Husayn رضي الله عنهما." },
  { id: "abdullah-son", name: "‘Abdullah", relation: "Son", group: "children", note: "A son of the Prophet ﷺ and Khadijah رضي الله عنها who died in childhood; historical reports also mention the names al-Tayyib and al-Tahir." },
  { id: "ibrahim", name: "Ibrahim", relation: "Son", group: "children", note: "A son of the Prophet ﷺ and Mariyah al-Qibtiyyah who died in infancy." },
  { id: "ali", name: "‘Ali ibn Abi Talib", honorific: "رضي الله عنه", relation: "Son-in-law and cousin", group: "descendants", note: "Cousin and son-in-law of the Prophet ﷺ, husband of Fatimah رضي الله عنها." },
  { id: "hasan", name: "Al-Hasan ibn ‘Ali", honorific: "رضي الله عنه", relation: "Grandson", group: "descendants", note: "Grandson of the Prophet ﷺ through Fatimah and ‘Ali رضي الله عنهما." },
  { id: "husayn", name: "Al-Husayn ibn ‘Ali", honorific: "رضي الله عنه", relation: "Grandson", group: "descendants", note: "Grandson of the Prophet ﷺ through Fatimah and ‘Ali رضي الله عنهما." },
  { id: "zaynab-grand", name: "Zaynab bint ‘Ali", honorific: "رضي الله عنها", relation: "Granddaughter", group: "descendants", note: "Granddaughter of the Prophet ﷺ through Fatimah and ‘Ali رضي الله عنهما." },
  { id: "umm-kulthum-grand", name: "Umm Kulthum bint ‘Ali", honorific: "رضي الله عنها", relation: "Granddaughter", group: "descendants", note: "Granddaughter of the Prophet ﷺ through Fatimah and ‘Ali رضي الله عنهما." },
];

function TreeNode({ id, active, compact = false, onSelect }: { id: string; active: string; compact?: boolean; onSelect: (id: string) => void }) {
  const person = people.find((item) => item.id === id)!;
  return <button className={`family-person-node ${compact ? "compact" : ""} ${active === id ? "active" : ""} ${id === "prophet" ? "prophet" : ""}`} type="button" onClick={() => onSelect(person.id)}><span>{person.relation}</span><strong>{person.name} {person.honorific}</strong></button>;
}

export default function FamilyTreeExplorer() {
  const [active, setActive] = useState("prophet");
  const [view, setView] = useState<"tree" | "wives" | "children">("tree");
  const selected = useMemo(() => people.find((person) => person.id === active) ?? people[3], [active]);
  const wives = people.filter((person) => person.group === "household" && person.id !== "prophet");
  const children = people.filter((person) => person.group === "children");

  return (
    <div className="family-explorer">
      <div className="family-view-tabs" role="group" aria-label="Family tree views"><button className={view === "tree" ? "active" : ""} type="button" onClick={() => setView("tree")}>Lineage tree</button><button className={view === "wives" ? "active" : ""} type="button" onClick={() => setView("wives")}>Mothers of the Believers</button><button className={view === "children" ? "active" : ""} type="button" onClick={() => setView("children")}>Children</button></div>

      <div className="family-explorer-shell">
        <section className="family-tree-canvas" aria-label="Interactive family tree">
          {view === "tree" && <div className="lineage-tree">
            <div className="tree-level ancestor"><TreeNode id="abdul-muttalib" active={active} onSelect={setActive} /></div>
            <span className="tree-connector vertical" />
            <div className="tree-level parents"><TreeNode id="abdullah" active={active} onSelect={setActive} /><span className="marriage-line">and</span><TreeNode id="aminah" active={active} onSelect={setActive} /></div>
            <span className="tree-connector vertical" />
            <div className="tree-level center"><TreeNode id="prophet" active={active} onSelect={setActive} /></div>
            <span className="tree-connector vertical long" />
            <div className="tree-level union"><TreeNode id="khadijah" active={active} onSelect={setActive} /><span className="marriage-line">family</span><TreeNode id="fatimah" active={active} onSelect={setActive} /></div>
            <span className="tree-connector vertical" />
            <div className="tree-level center"><TreeNode id="ali" active={active} onSelect={setActive} /></div>
            <span className="tree-connector branch" />
            <div className="tree-level descendants"><TreeNode id="hasan" compact active={active} onSelect={setActive} /><TreeNode id="husayn" compact active={active} onSelect={setActive} /><TreeNode id="zaynab-grand" compact active={active} onSelect={setActive} /><TreeNode id="umm-kulthum-grand" compact active={active} onSelect={setActive} /></div>
          </div>}

          {view === "wives" && <div className="family-card-view"><header><span>QURAN 33:6</span><h2>Mothers of the Believers</h2><p>Tap a name to read a short note. Ordering follows the commonly presented marriage sequence; no portraiture is used.</p></header><div>{wives.map((person) => <TreeNode id={person.id} compact active={active} onSelect={setActive} key={person.id} />)}</div></div>}

          {view === "children" && <div className="family-card-view"><header><span>THE PROPHET’S CHILDREN</span><h2>Seven children in the well-known account</h2><p>Six are commonly recorded as children of Khadijah رضي الله عنها, and Ibrahim as the son of Mariyah al-Qibtiyyah.</p></header><div>{children.map((person) => <TreeNode id={person.id} compact active={active} onSelect={setActive} key={person.id} />)}</div></div>}
        </section>

        <aside className="family-detail-panel"><span>{selected.relation.toUpperCase()}</span><h2>{selected.name}</h2>{selected.honorific && <b>{selected.honorific}</b>}<p>{selected.note}</p><div><strong>Respectful presentation</strong><small>This is a text-only educational map. Dates and extended lineages are omitted where historical reports differ.</small></div><Link href="/topics/family-tree">Read the sourced lineage guide →</Link></aside>
      </div>
    </div>
  );
}
