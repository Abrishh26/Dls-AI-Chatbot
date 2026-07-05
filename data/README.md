# /data — DLD/DLS & COAL Book Folder

Place your Digital Logic Design (DLD) or Digital Logic Studio (DLS) books here.  
Place COAL textbooks and notes here as well (e.g. COAL course book PDF).

## Supported formats
- `.pdf` — PDF textbooks
- `.txt` — Plain text files
- `.md` — Markdown outlines (e.g. `COAL_COURSE_OUTLINE.md`)

## How to ingest

After adding your books, run:

```bash
node scripts/ingest.js
```

This will chunk the books and upload them to Pinecone.
The chatbot will then answer questions based on your curriculum content.

## Suggested books
- Morris Mano — Digital Design
- Floyd — Digital Fundamentals
- Tocci — Digital Systems
- COAL / Computer Organization textbook (your course book)
- Any DLS or COAL course notes or slides (exported as PDF/text)

## COAL curriculum structure
See `COAL_COURSE_OUTLINE.md` in this folder and `frontend/src/data/coalCourseOutline.js` for the full module breakdown used on the platform.

## Notes
- Do NOT commit actual book PDFs to git (copyright). They are gitignored.
- You can re-run the ingestion script any time you add new books.
