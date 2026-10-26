# Learn Words · Little Objects

A buildless, responsive first version with 32 everyday object nouns and four modes. Serve `dist/` over HTTPS (microphone access requires a secure context).

## Behavior

- **Learn:** five words, 15 fixed 20-second slots (five active minutes); each word returns in all three passes. Listen three times, hear “Repeat”, record up to five seconds, automatic local playback. Pause stops active time; hiding the page pauses Learn. Audio is temporary and discarded at the next card.
- **Guess which?:** ten questions; the chosen object is spoken three times, with replay. Default four choices, adjustable to 2/4/6/8. Incorrect choices stay disabled while the learner retries.
- **Memo:** shuffled 4×4 grid with eight pairs. Reveal says the word three times; a match says it once more. Input locks while spoken feedback is playing so prompts cannot overlap.
- **Check!:** ten questions with a session report: first selection correct = remembered, any first-selection miss = practice, regardless of eventual success. This is an observation, not an asserted permanent mastery state.

## Data

IndexedDB database `little-objects`, version 1:

- `profiles`: ID, nickname, creation time, per-profile settings.
- `sessions`: ID, profile ID, mode, timestamps, completion, settings snapshot, duration, event count.
- `events`: append-only ID, profile ID, session ID, word ID, timestamp, type, mode. Answer events include selected word ID, correct, attempt number, first-try flag, question position, latency, and tile count. Exposure, recording (metadata only), and memory-turn events are separate.

Profile selection is in localStorage. Profiles are local learner partitions, **not authenticated accounts**. Data does not sync and is lost if site data is cleared. Export downloads one profile and its complete events/session history as JSON. Import and remote authentication are future work. Recordings are not uploaded or retained in the database. Browser speech engines may use the device vendor's online speech service.

## Future server migration

Keep stable UUID profile/session/event IDs and original vocabulary IDs (`en_XXXX`). Add an authenticated account table and account-to-profile ownership on the server. Enforce ownership on all reads and writes; client-supplied profile IDs must never imply authorization. Sync events idempotently by ID, derive scheduling/mastery from event history, and use indexed `(profile_id, timestamp)` queries. Existing JSON exports preserve the information needed for a future importer. Do not store recordings by default.

## Assets and voices

Audited object SVG illustrations, primarily from OpenMoji (`https://github.com/hfg-gmuend/openmoji`), licensed CC BY-SA 4.0. Attribution is shown in the app and the license is bundled at `dist/assets/LICENSE.txt`. Fork, plate and bowl are simplified adaptations; cup is an original standalone illustration. See ATTRIBUTION.md and IMAGE_AUDIT.md. All 32 pictures are bundled into a single content-versioned download, cached persistently when browser Cache Storage is available, and decoded into memory before play.

Browser SpeechSynthesis provides English pronunciation; no paid speech API or custom recordings are used. Voice availability depends on the browser/device. MediaRecorder provides local recording and playback. There is no automated pronunciation assessment.

## Checks

`npm test` (Node built-in runner; no install needed) checks spaced learning visits, distinct answer options at all grid sizes, first-attempt scoring, longitudinal check results, and memory pairs. Browser QA covers actual navigation and interactions; microphone capture needs a real permitted microphone and cannot be fully verified in a remote browser.

## GitHub Pages

This is a static app and works under project subdirectories. Enable GitHub Pages with GitHub Actions; `.github/workflows/pages.yml` publishes `dist/`. The GitHub Pages site is normally public, so visitors can open the link without ChatGPT. Learner data remains local to each browser. Data from the old domain does not automatically migrate: export first.

## License

Application code: MIT (see LICENSE). Artwork: CC BY-SA 4.0, with separate credits and modification notices in ATTRIBUTION.md and dist/credits.html. The MIT license does not replace the artwork license. Browser-provided voices are not bundled or redistributed in this repository.

## Vocabulary and sentences update

323 concrete vocabulary entries and 50 original illustrated action sentences. “What is happening?” plays one sentence three times; select its scene from 2, 4 (default), 6 or 8 choices. Choices mix boys and girls doing different actions. Ten questions per session, replay and first-attempt tracking per learner. Five completed sessions cover all 50 sentences. Images are bundled, decoded before play and cached. Sentence assets and original necktie SVG are MIT; OpenMoji artwork retains CC BY-SA 4.0. Browser voices depend on the learner’s device.

Check! now speaks the correct headword after every selection and advances automatically after correct answers. Memo speaks each revealed card twice, then reads one of 50 random, object-specific celebrations when a pair is matched.

Situations uses the same answer flow as Check!: every tap reads the correct sentence; a correct selection automatically advances after speech, with no Next button. Wrong choices allow another try.

Guess which? and Check! choose randomized same-category alternatives first, then related categories, and randomize the answer position.

Mixed play combines five object questions and five situation questions in a shuffled ten-question session. Each question keeps its own relevant alternatives. Wrong selections in Check!, Situations and Mixed play speak the selected picture’s word or sentence; replay repeats the target. Correct selections advance automatically.

Every new Memo game selects eight random words, avoiding the preceding Memo game’s eight words when at least eight fresh words are available. The selection is saved with the learner’s session, including games ended early.

## Sound recovery and gentler learning sets

The app now starts a spoken sound check directly inside the first game tap, before database awaits. A shared SpeechPlayer retains active utterances, resumes paused engines, respects installed English voices, retries unavailable/network voices once with the platform default, cancels hung requests, and reports distinct failures through a persistent Enable sound / retry control. Check!, Situations and Mixed play do not auto-advance a correct response if its speech fails; retry can finish that response. Learn pauses if speech fails. Device speech support is still required; successful hardware playback must be checked on affected devices.

Settings offers First words (40 familiar words), Everyday (129 familiar words; the default for existing and new learners), and Challenge (all 323). Levels apply to targets and distractors in object games, Memo, Learn, Mixed play and Show me. Interleaved topic ordering avoids long initial fruit-only sessions. No dictionary entries or progress histories are deleted.

Show me is a score-free, untimed exploration mode: tap a labelled picture to hear it twice, browse 12 pictures per page or filter by topic. Exploration taps are saved as exposures for the active learner.

## Teacher lesson codes

Enter a code on the home page. 1031 opens Halloween: 32 words plus 32 phrases/situations. 67 opens the unlisted Teen talk Easter egg: 32 informal words plus 32 humorous situations. Each learner retains their selected lesson until Leave lesson is used. The selection overrides normal word levels in every mode. No general vocabulary or normal situation targets enter a coded lesson; Show me covers all 64 entries. Prior progress is retained, and sessions/events include the lesson code. Topics are unlisted learning sets, not private or password-protected resources.

Lesson art loads and caches separately on entry. Source icons, composed SVG cards, metadata and bilingual CSV teacher lists are included in dist/assets/lessons, dist/topics.json and dist/lessons. Lesson lists are available at lesson.html?code=1031 or lesson.html?code=67. Phrase and slang cards use meaning cues as well as icons; these are not all literal action scenes. The teen set is playful, informal English, not an academic register.
