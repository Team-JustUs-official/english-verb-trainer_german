import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Lightbulb, Trophy, RotateCcw } from "lucide-react";

const verbs = [
  { base: "watch", past: "watched", pp: "watched", type: "reg." },
  { base: "open", past: "opened", pp: "opened", type: "reg." },
  { base: "clean", past: "cleaned", pp: "cleaned", type: "reg." },
  { base: "repair", past: "repaired", pp: "repaired", type: "reg." },
  { base: "help", past: "helped", pp: "helped", type: "reg." },
  { base: "write", past: "wrote", pp: "written", type: "irreg." },
  { base: "buy", past: "bought", pp: "bought", type: "irreg." },
  { base: "eat", past: "ate", pp: "eaten", type: "irreg." },
  { base: "find", past: "found", pp: "found", type: "irreg." },
  { base: "take", past: "took", pp: "taken", type: "irreg." },
  { base: "see", past: "saw", pp: "seen", type: "irreg." },
  { base: "make", past: "made", pp: "made", type: "irreg." },
  { base: "speak", past: "spoke", pp: "spoken", type: "irreg." },
  { base: "bring", past: "brought", pp: "brought", type: "irreg." },
  { base: "choose", past: "chose", pp: "chosen", type: "irreg." },
  { base: "drive", past: "drove", pp: "driven", type: "irreg." },
  { base: "forget", past: "forgot", pp: "forgotten", type: "irreg." },
  { base: "give", past: "gave", pp: "given", type: "irreg." },
  { base: "break", past: "broke", pp: "broken", type: "irreg." },
  { base: "build", past: "built", pp: "built", type: "irreg." },
];

const subjects = [
  { text: "I", bePres: "am", bePast: "was", have: "have", doPres: "do" },
  { text: "you", bePres: "are", bePast: "were", have: "have", doPres: "do" },
  { text: "he", bePres: "is", bePast: "was", have: "has", doPres: "does" },
  { text: "she", bePres: "is", bePast: "was", have: "has", doPres: "does" },
  { text: "we", bePres: "are", bePast: "were", have: "have", doPres: "do" },
  { text: "they", bePres: "are", bePast: "were", have: "have", doPres: "do" },
  { text: "the letter", bePres: "is", bePast: "was", have: "has", doPres: "does" },
  { text: "the keys", bePres: "are", bePast: "were", have: "have", doPres: "do" },
  { text: "the cake", bePres: "is", bePast: "was", have: "has", doPres: "does" },
  { text: "the windows", bePres: "are", bePast: "were", have: "have", doPres: "do" },
];

const tenses = [
  { key: "presS", label: "Pres. s.", full: "Present Simple" },
  { key: "presProg", label: "Pres. prog.", full: "Present Progressive" },
  { key: "pastS", label: "Past s.", full: "Simple Past" },
  { key: "presPerf", label: "Pres. perf.", full: "Present Perfect" },
  { key: "pastPerf", label: "Past perf.", full: "Past Perfect" },
  { key: "willF", label: "will-F.", full: "will-future" },
  { key: "goingTo", label: "going-to-F.", full: "going-to-future" },
];

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalize(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[?.!]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/don't/g, "do not")
    .replace(/doesn't/g, "does not")
    .replace(/didn't/g, "did not")
    .replace(/isn't/g, "is not")
    .replace(/aren't/g, "are not")
    .replace(/wasn't/g, "was not")
    .replace(/weren't/g, "were not")
    .replace(/haven't/g, "have not")
    .replace(/hasn't/g, "has not")
    .replace(/hadn't/g, "had not")
    .replace(/won't/g, "will not");
}

function continuousForm(verb) {
  if (verb.base.endsWith("ie")) return verb.base.slice(0, -2) + "ying";
  if (verb.base.endsWith("e") && !verb.base.endsWith("ee")) return verb.base.slice(0, -1) + "ing";
  return verb.base + "ing";
}

function sForm(subject, verb) {
  if (!["he", "she", "it", "the letter", "the cake"].includes(subject.text)) return verb.base;
  if (verb.base.endsWith("y") && !"aeiou".includes(verb.base.at(-2))) return verb.base.slice(0, -1) + "ies";
  if (["s", "x", "z"].includes(verb.base.at(-1)) || verb.base.endsWith("ch") || verb.base.endsWith("sh") || verb.base.endsWith("o")) return verb.base + "es";
  return verb.base + "s";
}

function statementPunctuation(kind) {
  return kind === "?" ? "?" : ".";
}

function buildActive(subject, verb, tense, kind) {
  const S = cap(subject.text);
  const p = statementPunctuation(kind);
  const ing = continuousForm(verb);

  const positive = {
    presS: `${S} ${sForm(subject, verb)}${p}`,
    presProg: `${S} ${subject.bePres} ${ing}${p}`,
    pastS: `${S} ${verb.past}${p}`,
    presPerf: `${S} ${subject.have} ${verb.pp}${p}`,
    pastPerf: `${S} had ${verb.pp}${p}`,
    willF: `${S} will ${verb.base}${p}`,
    goingTo: `${S} ${subject.bePres} going to ${verb.base}${p}`,
  };

  const negative = {
    presS: `${S} ${subject.doPres} not ${verb.base}${p}`,
    presProg: `${S} ${subject.bePres} not ${ing}${p}`,
    pastS: `${S} did not ${verb.base}${p}`,
    presPerf: `${S} ${subject.have} not ${verb.pp}${p}`,
    pastPerf: `${S} had not ${verb.pp}${p}`,
    willF: `${S} will not ${verb.base}${p}`,
    goingTo: `${S} ${subject.bePres} not going to ${verb.base}${p}`,
  };

  const question = {
    presS: `${cap(subject.doPres)} ${subject.text} ${verb.base}?`,
    presProg: `${cap(subject.bePres)} ${subject.text} ${ing}?`,
    pastS: `Did ${subject.text} ${verb.base}?`,
    presPerf: `${cap(subject.have)} ${subject.text} ${verb.pp}?`,
    pastPerf: `Had ${subject.text} ${verb.pp}?`,
    willF: `Will ${subject.text} ${verb.base}?`,
    goingTo: `${cap(subject.bePres)} ${subject.text} going to ${verb.base}?`,
  };

  if (kind === "+") return positive[tense.key];
  if (kind === "-") return negative[tense.key];
  return question[tense.key];
}

function buildPassive(subject, verb, tense, kind) {
  const S = cap(subject.text);
  const p = statementPunctuation(kind);
  const pp = verb.pp;

  const positive = {
    presS: `${S} ${subject.bePres} ${pp}${p}`,
    presProg: `${S} ${subject.bePres} being ${pp}${p}`,
    pastS: `${S} ${subject.bePast} ${pp}${p}`,
    presPerf: `${S} ${subject.have} been ${pp}${p}`,
    pastPerf: `${S} had been ${pp}${p}`,
    willF: `${S} will be ${pp}${p}`,
    goingTo: `${S} ${subject.bePres} going to be ${pp}${p}`,
  };

  const negative = {
    presS: `${S} ${subject.bePres} not ${pp}${p}`,
    presProg: `${S} ${subject.bePres} not being ${pp}${p}`,
    pastS: `${S} ${subject.bePast} not ${pp}${p}`,
    presPerf: `${S} ${subject.have} not been ${pp}${p}`,
    pastPerf: `${S} had not been ${pp}${p}`,
    willF: `${S} will not be ${pp}${p}`,
    goingTo: `${S} ${subject.bePres} not going to be ${pp}${p}`,
  };

  const question = {
    presS: `${cap(subject.bePres)} ${subject.text} ${pp}?`,
    presProg: `${cap(subject.bePres)} ${subject.text} being ${pp}?`,
    pastS: `${cap(subject.bePast)} ${subject.text} ${pp}?`,
    presPerf: `${cap(subject.have)} ${subject.text} been ${pp}?`,
    pastPerf: `Had ${subject.text} been ${pp}?`,
    willF: `Will ${subject.text} be ${pp}?`,
    goingTo: `${cap(subject.bePres)} ${subject.text} going to be ${pp}?`,
  };

  if (kind === "+") return positive[tense.key];
  if (kind === "-") return negative[tense.key];
  return question[tense.key];
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeTask() {
  const verb = randomItem(verbs);
  const tense = randomItem(tenses);
  const kind = randomItem(["+", "-", "?"]);
  const voice = randomItem(["act.", "pass."]);
  const subject = voice === "pass."
    ? randomItem(subjects.filter(s => !["I", "you", "he", "she", "we", "they"].includes(s.text)))
    : randomItem(subjects.filter(s => ["I", "you", "he", "she", "we", "they"].includes(s.text)));
  const answer = voice === "pass." ? buildPassive(subject, verb, tense, kind) : buildActive(subject, verb, tense, kind);
  return { verb, tense, kind, voice, subject, answer };
}

export default function App() {
  const [task, setTask] = useState(() => makeTask());
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const isCorrect = useMemo(() => normalize(input) === normalize(task.answer), [input, task.answer]);
  const requirement = `${cap(task.subject.text)} ${task.verb.base} ${task.tense.label} ${task.voice} ${task.kind}`;

  function check() {
    if (!input.trim()) return;
    if (!checked) {
      setScore(s => ({ right: s.right + (isCorrect ? 1 : 0), total: s.total + 1 }));
    }
    setChecked(true);
  }

  function nextTask() {
    setTask(makeTask());
    setInput("");
    setChecked(false);
  }

  function resetScore() {
    setScore({ right: 0, total: 0 });
  }

  return (
    <main className="page">
      <section className="app-shell">
        <header className="hero">
          <h1>English Verb Forms Trainer</h1>
          <p>Copyright by Felix Sacher from Team JustUs Germany</p>
        </header>

        <section className="card main-card">
          <div className="info-grid">
            <div className="info-box">
              <span>Verb</span>
              <strong>{task.verb.base} <small>({task.verb.type})</small></strong>
            </div>
            <div className="info-box">
              <span>Zeit</span>
              <strong>{task.tense.label}</strong>
              <small>{task.tense.full}</small>
            </div>
            <div className="info-box">
              <span>Voice</span>
              <strong>{task.voice}</strong>
            </div>
            <div className="info-box">
              <span>Satzart</span>
              <strong>{task.kind}</strong>
            </div>
          </div>

          <div className="requirement-box">
            <span>Anforderung</span>
            <strong>{requirement}</strong>
          </div>

          <label className="answer-label" htmlFor="answer">Deine Lösung</label>
          <input
            id="answer"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setChecked(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
            className="answer-input"
            placeholder="z. B. Is the letter being written?"
          />

          <div className="button-row">
            <button className="primary-button" onClick={check}>Direkt korrigieren</button>
            <button className="secondary-button" onClick={nextTask}>
              <RefreshCw size={18} /> Neue Aufgabe
            </button>
            <button className="secondary-button" onClick={resetScore}>
              <RotateCcw size={18} /> Score zurücksetzen
            </button>
          </div>

          {checked && (
            <div className={isCorrect ? "result result-correct" : "result result-wrong"}>
              {isCorrect ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
              <div>
                <strong>{isCorrect ? "Richtig!" : "Noch nicht ganz."}</strong>
                <p>Korrekte Lösung: <b>{task.answer}</b></p>
              </div>
            </div>
          )}

          <div className="bottom-grid">
            <div className="hint-box">
              <Lightbulb size={22} />
              <p>Tipp: <b>p./pass.</b> bedeutet passive voice. Dann brauchst du fast immer eine Form von <b>be</b> + past participle.</p>
            </div>
            <div className="score-box">
              <Trophy size={22} />
              <strong>Score: {score.right} / {score.total}</strong>
            </div>
          </div>
        </section>

        <section className="card abbreviations">
          <div>
            <strong>Abkürzungen</strong>
            <p><b>Pres. s.</b> = Present Simple</p>
            <p><b>Pres. prog.</b> = Present Progressive</p>
            <p><b>Past s.</b> = Simple Past</p>
            <p><b>Pres. perf.</b> = Present Perfect</p>
          </div>
          <div>
            <p><b>Past perf.</b> = Past Perfect</p>
            <p><b>will-F.</b> = will-future</p>
            <p><b>going-to-F.</b> = going-to-future</p>
            <p><b>+</b> positive, <b>-</b> negative, <b>?</b> question</p>
          </div>
        </section>
      </section>
    </main>
  );
}
