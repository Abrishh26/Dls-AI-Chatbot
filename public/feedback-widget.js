// public/feedback-widget.js
// Renders a thumbs up/down control under a bot answer, and logs the
// rating to /api/feedback along with the question, answer, and
// retrieved chunks passed in via `data`. On thumbs-down, a small
// optional comment box appears so the user can say what was wrong —
// this gets saved as `comment` in the same feedback entry.

function attachFeedbackWidget(container, data) {
  const wrapper = document.createElement("div");
  wrapper.className = "feedback-widget";

  const row = document.createElement("div");
  row.className = "feedback-row";

  const label = document.createElement("span");
  label.className = "feedback-label";
  label.innerText = "Rate this answer";

  const upBtn = document.createElement("button");
  upBtn.className = "feedback-btn feedback-up";
  upBtn.setAttribute("aria-label", "Helpful");
  upBtn.innerHTML = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h12.9a2 2 0 0 0 2-1.7l1.4-9A2 2 0 0 0 18.3 9H14V4a2 2 0 0 0-2-2L7 11"/>
  </svg>`;

  const downBtn = document.createElement("button");
  downBtn.className = "feedback-btn feedback-down";
  downBtn.setAttribute("aria-label", "Not helpful");
  downBtn.innerHTML = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 2v11M22 11v-7a2 2 0 0 0-2-2H7.1a2 2 0 0 0-2 1.7l-1.4 9A2 2 0 0 0 5.7 15H10v5a2 2 0 0 0 2 2l5-9"/>
  </svg>`;

  const status = document.createElement("span");
  status.className = "feedback-status";

  // --- optional comment box, shown only after thumbs-down ---
  const commentBox = document.createElement("div");
  commentBox.className = "feedback-comment-box";
  commentBox.style.display = "none";

  const commentInput = document.createElement("textarea");
  commentInput.className = "feedback-comment-input";
  commentInput.placeholder = "What was wrong with this answer? (optional)";
  commentInput.rows = 2;

  const commentSubmit = document.createElement("button");
  commentSubmit.className = "feedback-comment-submit";
  commentSubmit.innerText = "Send";

  const commentSkip = document.createElement("button");
  commentSkip.className = "feedback-comment-skip";
  commentSkip.innerText = "Skip";

  const commentActions = document.createElement("div");
  commentActions.className = "feedback-comment-actions";
  commentActions.appendChild(commentSubmit);
  commentActions.appendChild(commentSkip);

  commentBox.appendChild(commentInput);
  commentBox.appendChild(commentActions);

  let downEntryId = null; // id of the thumbs-down entry, so we can attach a comment to it

  async function sendFeedback(rating) {
    upBtn.disabled = true;
    downBtn.disabled = true;
    status.innerText = "Saving…";

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating }),
      });

      if (!res.ok) throw new Error("Request failed");
      const result = await res.json();

      status.innerText = rating === "up" ? "Thanks for the feedback" : "Thanks — we'll review this";
      (rating === "up" ? upBtn : downBtn).classList.add("selected");

      if (rating === "down") {
        downEntryId = result.id;
        commentBox.style.display = "block";
        commentInput.focus();
      }
    } catch (err) {
      status.innerText = "Couldn't save feedback";
      upBtn.disabled = false;
      downBtn.disabled = false;
    }
  }

  async function sendComment() {
    const comment = commentInput.value.trim();
    commentBox.style.display = "none";
    if (!comment || !downEntryId) return;

    try {
      await fetch(`/api/feedback/${downEntryId}/comment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      status.innerText = "Thanks for the detail — noted";
    } catch (err) {
      // silent fail is fine here; the thumbs-down rating is already saved
    }
  }

  upBtn.addEventListener("click", () => sendFeedback("up"));
  downBtn.addEventListener("click", () => sendFeedback("down"));
  commentSubmit.addEventListener("click", sendComment);
  commentSkip.addEventListener("click", () => { commentBox.style.display = "none"; });

  row.appendChild(label);
  row.appendChild(upBtn);
  row.appendChild(downBtn);
  row.appendChild(status);

  wrapper.appendChild(row);
  wrapper.appendChild(commentBox);
  container.appendChild(wrapper);
}