2026-03-29
==========

For this next stage, I'm going to do everything I can without help from A.I. 

The goal here is to:
- Get all the BLS Wage datasets pushed to tables in postgres
- Follow through the outlined steps from the Springboard assignments
- Get all the data properly sorted and wrangled so that I can turn it in

---

I was able to get the Nat sheet for Field Descriptions initially sorted into the format that I wanted.

I used a lot of Google for finding pandas functions. 

Getting the index and column names figured out took a bit.

---

I was able to get all five of the BLS data files roughly established in a pandas df. 

From here, next steps would be to push this initial rough data to psotgres, before making any further changes.

I'm not sure what kinds of issues may crop up. There's null values, atypical type values, etc. How to deal with that is going to be a challenge.

The general idea is to have a starting point that's as fresh and close to the original as possible. Then, with each stage, I will create a set of meta data, adapted according to the progress I make towards the end goal. 

Another key part of the idea is that each time I go from stages in the data, I pull the previous stage of the data out of postgres into jupyter, make changes, then push it back into a new schema or something. 

That way, if I discover I've done something wrong, I can go back in stages, rewrite the jupyter notebook code associated, and rerun from that stage going forward.

This may not work in a live production environment with updating data, but it seems to be the right approach for this static dataset.

I used this command to convert the docs to html for my wordpress blog:

```
jupyter nbconvert --to html 01-01-wrangling-onet-train-reward-compare.ipynb
```
