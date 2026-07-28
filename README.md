# Radiant — Persona Chat v2

A rebuild of Radiant's persona chat: the interface clients use to interview AI personas after running a simulated survey. Built for the Artificial Societies product task.

The existing chat works, but clients don't trust it and don't know what it's for. Every feature in this build traces back to a specific piece of client feedback.

## Client feedback → features

| What clients said | The underlying problem | What this build does about it |
|---|---|---|
| "I don't know when or why I should use the chats" | The chat has no stated purpose. It opens cold, with an empty input box. | Frame chat as a research interview. The entry point explains what personas can tell you; suggested questions seed the first message from the persona's survey response. |
| "I keep losing my chats after I log off" | No persistence. Conversations die with the session. | Conversations are saved and resumable. A history panel lists past interviews per persona and per survey. |
| "I don't know any details about who I'm talking to" | Persona context lives in the graph tooltip, then disappears once the chat opens. | Persistent profile panel beside the chat: attributes, survey choice, and their verbatim comment stay in view for the whole conversation. |
| "I don't trust the chat and their responses" | Nothing signals where an answer comes from. | Replies visibly separate what's grounded in the persona's data from what's simulated extrapolation. |
| "How do I know if what they're saying is backed by real data or just made up?" | No provenance. Data-backed claims and invention look identical. | Inline citations on persona replies. Each cited claim links to its source: the survey response, a profile attribute, or a flagged simulation. |

The last two concerns are the core product risk: a research tool nobody trusts doesn't get used. So provenance is treated as the headline feature here, not a footnote.

## Running locally

```bash
npm install
npm run dev
```

The chat is mocked per the brief; no API keys required.
