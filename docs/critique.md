# Critique — the v1 persona chat

Working notes on the current interface, done before designing anything. Each finding names the evidence, the principle it breaks (numbers reference `design.md`), and the v2 decision it produced. The five client quotes from the brief are the ground truth; this critique is about locating *where in the interface* each complaint is earned.

![v1 results view](assets/v1-results.png)
![v1 chat view](assets/v1-chat.png)

## Findings

**1. The chat opens cold.**
A greeting-free thread, an empty composer, no statement of what this conversation is for or good at. Users are left to invent a use case ("I don't know when or why I should use the chats"). Breaks 6 and 12: no guidance, no telegraphing of capability.
→ v2: entry state frames the chat as a research interview and seeds it with questions derived from this persona's actual response.

**2. The disclaimer does the opposite of its job.**
"All thoughts, views and opinions are purely fictional" sits as fine print above the thread: a legal notice where a credibility system should be. It concedes the trust problem and then provides nothing to manage it. Breaks 2 and 13.
→ v2: replace blanket disclaimer with per-claim provenance. Fictional-vs-grounded is decided at the level of each statement, not the whole product.

**3. Replies are fluent invention with no visible basis.**
The persona discusses AI roadmaps and jiu-jitsu training: plausible, confident, and unlinked to any data the platform holds. Fluency reads as truth, which is exactly the mechanism behind "how do I know if what they're saying is backed by real data or just made up?". Breaks 1, 8, 11. The sharpest version of the problem: the platform's method page claims every response is interpretable, and the chat surfaces none of that interpretability.
→ v2: citations on persona claims, a grounded/simulated distinction inline, and profile-derived reasoning made visible.

**4. The persona has no boundaries.**
Nothing in v1 suggests the persona can decline or flag uncertainty; it will answer anything in the same confident register. A system with no visible failure states gives users no way to calibrate. Breaks 12.
→ v2: the persona refuses questions outside its data and says so, in the interface's voice, as a designed state.

**5. Who am I talking to? One line.**
Name, title, avatar. The rich profile from the results view (location, generation, seniority, industry, survey choice, verbatim comment) vanishes once the chat opens; the conversation floats free of the data that justified it. Breaks 15; complaint 3 verbatim.
→ v2: persistent profile panel beside the thread, carrying the survey response and the persona's construction basis for the whole conversation.

**6. The chat is a dead-end overlay.**
A modal floating over the blurred graph: no history, no way to revisit yesterday's interview, closing it destroys the session ("I keep losing my chats after I log off"). Conversation-as-modal also severs the link back to the survey results it came from. Breaks 4, 15, 16.
→ v2: conversations are first-class saved objects with a history surface, and the survey context stays reachable.

**7. Craft defaults.**
Default-grey bubbles, floating unanchored timestamps, a retry icon with no label, the send button in a faded state that reads disabled. None of it is broken; none of it is considered. Small defaults compound into "least-loved part of the platform". Breaks 3, 17, 18.
→ v2: full pass under the design system's foundations; every control labelled, every state styled.

## What v1 gets right

Kept deliberately: the graph-to-persona drill-in is a strong entry flow; the persona card on the results view is information-dense and well-ordered; the italic serif treatment of verbatim comments is distinctive and reads as "real person said this". v2 extends that serif convention into the citation system.
