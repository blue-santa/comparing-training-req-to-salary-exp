2026-03-30
==========

I'm exploring the columns and data types now. 

I made some edits on two separate machines in the same github repo and the edits conflict. This is the issue with .ipynb files. It's not possible to simply merge. 

I'll need to rebase or something.

---

I've spent the last hour or more trying to find a definitive confirmation as to the meaning of "#" and other potential strings in numerical columns. 

The only answers I have found have come through Google Searches where AI Mode takes over. 

The AI Mode gives me different answers, depending on how I ask the question.

I've heard that it means either that the value is capped at being too high to report reliably, or so high that confidentiality is an issue. Alternatively, I've heard that it means that there's too few data samples to allow for a reliable report. I've also heard that it means.

I've focused on `h_pct90` as a column, just at random.

There are many `float` values. Those are fine and can stay as they are.

There are two `str` values, `#` and `*`. Again, I don't know what they mean.

There are `int` values: `[85, 110, 86, 61, 40, 60, 50, 20, 29, 54, 23, 35, 33]`

That's odd. That almost looks like code markers?

I've spent too much time trying to find a legend or a key on `bls.gov`, and am not getting anywhere. I'm going to ask Claude AI for help. I'm not sure whom else I can ask, so this seems like I am otherwise just wasting time. I can only imagine asking around on Reddit or something and hoping for a response from someone who knows. I can keep that option for later.

---

Okay, after asking Claude, it was able to point me in the right direction, as far as the `str` values go.

The descriptions are found at the bottom of the `Field Description` sheets.

`'#  = indicates a wage equal to or greater than $115.00 per hour or $239,200 per year '`

`'*  = indicates that a wage estimate is not available'`

There's still no answer about the `int` values, though.

I asked Claude. It opined that these are just whole-dollar `float` values that were stripped and converted to `int` values when pulled into Pandas. So, I'll just need to recast later to `float`, once the column is ready.

---


