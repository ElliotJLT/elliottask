# Radiant — Persona Chat v2

A rebuild of the persona chat: the surface clients use to interview a respondent after running a simulated survey. Built for the Artificial Societies product task.

The old chat works. Clients don't trust it and can't tell what it's for, which are different problems with a common cause: nothing in the interface says where an answer came from.

**Start here:** open the society, select a lit respondent, read their record, then interview them. Ask *"why did you choose Spring?"*, then ask *"would everyone on your team say the same?"* and watch what the persona does with the second one.

## The feedback, and what the build does about it

| What clients said | What's actually wrong | What's built |
|---|---|---|
| "I don't know when or why I should use the chats" | The chat opens cold. Its only call to action names the mechanism, not the reason. | Interviews are reached through the population, so you arrive having chosen someone and knowing why. An interview with no messages opens with questions derived from that respondent's own answer, not generic prompts. |
| "I keep losing my chats after I log off" | No persistence. The chat is a modal over a blurred graph and closing it destroys the session. | Transcripts are written to browser storage and read back through React's external-store API. Refresh the page mid-interview: it's still there. |
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

**Sources are counted.** The pill in the interview header opens a summary of everything the conversation has rested on, split into grounded and extrapolated. Per-claim markers answer "is this sentence evidence". The count answers the question a client carries into a decision, which is how much of the whole conversation was.

## Running it

```bash
npm install
npm run dev
```

No API keys. The chat is mocked per the brief. Still needs deploying for a submittable URL.

## What I'd do with more time

**Compare two respondents side by side.** The weakest seam in the current flow: the record step decides whether someone is worth interviewing, but you can only look at one at a time, and browsing is fundamentally about choosing between people. Holding the Winter respondent next to the Autumn one, and asking both the same question, is real research behaviour that the current build can't support.

**Real persistence.** Browser storage answers the complaint but doesn't survive a device change. The domain types in `src/lib/types.ts` are shaped the way the production schema would be, one type per table with references as foreign keys, so the store functions in `src/lib/store.ts` are the seam a real database slots behind.

**The society at full scale.** The graph renders a 250-respondent sample. Three thousand nodes needs aggregation, level-of-detail, and probably canvas rather than SVG. The interface says "a sample" rather than pretending otherwise, which is honest but not a solution.

**Interview more than one respondent at once.** Put the same question to five people across different answers and read the spread. Closer to how a researcher actually works than one conversation at a time.

**Export a transcript with its sources intact.** These conversations end up in decks and board papers. If the provenance doesn't travel with the quote, the trust work stops at the edge of the app.

**Instrument the trust question.** Log whether users expand sources, and whether they ask follow-ups after a refusal or abandon. That tells you if provenance is being used or just displayed.

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
