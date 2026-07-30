# Radiant — Persona Chat v2

A rebuild of the persona chat: the surface clients use to interview a respondent after running a simulated survey. Built for the Artificial Societies product task.

The old chat works. Clients don't trust it and can't tell what it's for, which are different problems with a common cause: nothing in the interface says where an answer came from.

**Start here:** open the society, select a lit respondent, read their record, then interview them. Ask *"why did you choose Spring?"*, then ask *"would everyone on your team say the same?"* and watch what the persona does with the second one.

## The feedback, and what the build does about it

| What clients said | What's actually wrong | What's built |
|---|---|---|
| "I don't know when or why I should use the chats" | The chat opens cold. Its only call to action names the mechanism, not the reason. | Interviews are reached through the population, so you arrive having chosen someone and knowing why. An interview with no messages opens with questions derived from that respondent's own answer, not generic prompts. |
| "I keep losing my chats after I log off" | No persistence. The chat is a modal over a blurred graph and closing it destroys the session. | Transcripts are written to browser storage and read back through React's external-store API, so a refresh mid-interview loses nothing. Every started interview lands in a Recent Interviews list with its last message and status, one click to resume or start fresh. |
| "I don't know any details about who I'm talking to" | The rich profile sits in the results view and vanishes when the chat opens. | The respondent record sits beside the transcript for the whole conversation, so every claim can be checked against the profile that produced it. |
| "I don't trust the chat and their responses" | A blanket disclaimer at the top of the thread concedes the problem and manages none of it. | No disclaimer. Claims are marked individually, and the respondent refuses questions it can't answer from data. |
| "How do I know if what they're saying is backed by real data or just made up?" | Fluent invention and grounded fact look identical. | Every claim carries a marker: solid for grounded in the survey answer or profile, dashed for the model reasoning past both. Sources sit under each reply with the verbatim quote. |

`docs/critique.md` has the full audit, including problems clients haven't articulated but are probably reacting to.

## Three steps, in the order the work happens

**Browse.** The society is a sample of the population, with respondents drawn toward others who answered as they did. The result legend doubles as a filter: mute an option and that community dims where it sits rather than vanishing, so you keep seeing how much of the whole you're looking at.

**Read a respondent.** Selecting a lit dot opens their record: their answer, their own words at reading size, their profile, and how the respondent was built.

**Interview.** The record slides left and stays. The map goes, because it has no job during a conversation.

Overview first, then filter, then detail on demand. That ordering is Shneiderman's, and the reasoning is in `docs/decisions.md`.

## Trust is the feature, not a disclaimer

The mocked reply engine exists to demonstrate the citation system rather than to imitate a language model. Every reply is assembled from the respondent's own record, so a claim is either traced to their survey response, traced to a profile attribute, or explicitly marked as extrapolation.

Two consequences worth looking at:

**The respondent refuses.** Ask about people who weren't surveyed and it says plainly that it would be guessing, then suggests running the question across the population instead. A system with no visible failure states gives no signal worth trusting. It's also the commercially correct answer: the right response to a question one respondent can't answer is another survey.

**Sources are counted.** A column beside the transcript collects everything the conversation has rested on, split into grounded and extrapolated. Per-claim markers answer "is this sentence evidence". The column answers the question a client carries into a decision, which is how much of the whole conversation was.

## The work around the chat

A conversation is one moment in a longer job, so the build gives that job somewhere to live.

**Resume, don't restart.** Every interview with messages sits in a Recent Interviews list beside the survey: who, the last thing said, whether it's still going. One click resumes it, another starts it fresh with the same respondent.

**Keep what matters.** Bookmark any reply and it lands in Findings, held with the respondent and its sources across every interview in the project, so research ends somewhere other than a scroll back up the thread.

**Leave with it.** Export a transcript and the provenance travels with it. Each reply carries its grounded quotes and its flagged extrapolations as footnotes, because these end up in decks where the quote and its source have to stay together.

## Running it

```bash
npm install
npm run dev
```

No API keys. The chat is mocked per the brief. Still needs deploying for a submittable URL.

## How I built this

Worth reading if the interesting question is how someone works, not just what they shipped. The commit history is the honest record: 60 commits, and the first six are all documents.

**The complaint list was the spec, and I refused to treat it as one.** Five quotes came with the brief. Taking them literally gets you a tooltip that says "this is AI generated" and a save button. So the first pass was an audit, not a build: `docs/critique.md` separates what clients said from what is actually wrong underneath, which is where "I don't trust it" turns into "fluent invention and grounded fact are rendered identically". Every feature in the table at the top of this README traces to a line in that audit. Anything that didn't, didn't get built.

**I wrote the constraints down before writing code, so the constraints could win arguments later.** `docs/design.md` is a binding system: tokens, motion thresholds, and twenty-two interaction principles covering trust, conversation, and how to draw a population. `docs/decisions.md` records the calls that had a plausible alternative, with the alternative. Both are checked into the repo and referenced from `CLAUDE.md`, which means an AI agent working in this codebase reads them before it touches a file. That is the actual trick: the design system is not a PDF nobody opens, it is the thing the machine is held to. When I asked for a soft background behind the society and got a grey rectangle, the reason it went back out is principle 21, position carries community and nothing else should be varying. The system caught it, not my mood that afternoon.

**Schema before screens.** `src/lib/types.ts` is shaped the way the production schema would be, one type per table with references as foreign keys. The mock store in `src/lib/store.ts` reads like a database, so the seam a real backend slots behind already exists. Commit five is the domain model. The first pixel is commit ten.

**I routed the work across three models rather than using one for everything.** The build ran in Claude Code inside Conductor, so several workstreams could go at once. Roughly the first twenty commits, the part that is all documents and domain modelling, were planned with Claude Fable 5 working alongside Opus: the hardest reasoning in the project is the audit and the design system, because every later decision inherits from them, and that is what the top tier is for. Once the shape was settled the work changed character. Scaffolding a component, wiring the external store, adding a citation marker, fixing a spacing bug: each is small, well-specified, and has a right answer. That is Sonnet 5's territory, near the top tier on coding and agentic tasks at a fraction of the cost, so the quickfire loop ran there and I kept the expensive models for the decisions that actually needed them. Routing by task rather than defaulting to the biggest model is the difference between a demo you can afford to iterate on and one you build once and stop touching.

**What did not delegate.** The product decisions, the audit, the design system, the call on what the five complaints really mean, and the repeated no to things that looked plausible and served nothing. Models are unreliable at taste and at knowing when to stop. Most of the iteration in the back half of this history is me rejecting output, and the commit messages record why rather than what. The grey smudge behind the society graph made it into a commit and straight back out again, which is the process working rather than failing.

**I checked it in a browser, every time.** Not typecheck and vibes. Each change was driven headlessly and screenshotted, so "the findings drawer works" means a reply was actually bookmarked, the page was actually reloaded, and the quote was actually still there. Several bugs in this README's feature list were caught that way and never reached a commit.

## What I'd do with more time

**Wire up the group interview.** The composer's invite and the map's shift-click both gather a group already. What's missing is the thing they gather toward: putting one question to five respondents across different answers and reading the spread, which is how research actually works and what browsing between people is for. The build stages this and doesn't yet run it. It's also the honest answer to a question one respondent can't give, which is another survey.

**Lean the trust work on the refusal, not the markers.** Every claim carries a grounded or extrapolated marker, on the assumption that marking raises trust. It might not. A dashed marker can read as "made up" rather than "reasoned past the data", and take the whole conversation down with it. The mark that clearly earns its place is the refusal, where the persona won't speak for people who weren't surveyed and points at running another survey, honest and commercially right in one move. I'd make the per-claim marks quieter, put the weight on that moment, and test whether it reads as more trustworthy rather than less.

**Put a designer on the surface I deliberately under-reached.** The palette is tuned for one job: keeping four survey options separable from each other and from the grounded/simulated pair, at accessible contrast, so no colour in the interface is ever decorative. That was the right trade for a tool whose whole argument is evidence, and it is the reason the provenance reads at a glance. It also leaves the product cooler than Radiant's brand deserves, and it has no dark mode. Both are the work of someone who does colour systems for a living: an expressive palette that carries warmth and still holds the data encoding, built twice for light and dark with the semantic tokens already in `globals.css` as the seam. The same goes for the society. It's a 2D map because position has to mean community and stay put between visits, which rules out free rotation as a default. Whether a dimensional, manipulable version of that map could hold the encoding and add real spatial understanding is a genuine design question, and a designer plus a graphics engineer would answer it better than I would alone. I've built to a system I can defend line by line; those two are where a specialist multiplies it rather than tidies it.

**Real persistence.** Browser storage answers the complaint but doesn't survive a device change. The domain types in `src/lib/types.ts` are shaped the way the production schema would be, one type per table with references as foreign keys, so the store functions in `src/lib/store.ts` are the seam a real database slots behind.

**The society at full scale.** The graph renders a 250-respondent sample. Three thousand nodes needs aggregation, level-of-detail, and probably canvas rather than SVG. The interface says "a sample" rather than pretending otherwise, which is honest but not a solution.

**Instrument the trust question.** Log whether users open the sources column, and whether they ask follow-ups after a refusal or abandon. That tells you if provenance is being used or just displayed.

## Research I'd run

The build assumes clients want provenance. That's a hypothesis, not a finding.

**Watch five clients answer a live question.** Not a usability test on this interface. Give them a real decision they're facing, their own survey, and see whether they reach for an interview at all. If nobody does, the framing is wrong and no amount of trust marking will fix it.

**Trust calibration.** Show one group answers with markers and one without, then ask both how much they'd rely on specific claims. The design assumes marking extrapolation raises trust in the rest. It could plausibly do the opposite and make the whole thing feel shaky. Worth knowing which.

**Comprehension of the markers.** Does anyone read a dashed marker as "made up" when it means "reasoned from the profile"? The distinction is load-bearing and I've only tested it on myself.

**Talk to the forward-deployed engineers.** They sit with clients when this breaks and will know the failure modes that never reach a feedback form.

**Diary study on returning.** Persistence assumes people come back to interviews. Do they, and what do they need when they do? A saved transcript might need a summary at the top rather than a scroll back through it.

## Notes on scope

Mock data lives in `src/lib/fixtures/`, deterministic and typed. The survey graph and results exist as entry context rather than as a rebuild of the results view. Design system is `docs/design.md` and its tokens are in `globals.css`; both are binding on the build. `docs/decisions.md` records the calls that had a plausible alternative.

Six respondents have loaded profiles. In the product every dot would be interviewable; here the lit ones are the ones with fixtures behind them.
