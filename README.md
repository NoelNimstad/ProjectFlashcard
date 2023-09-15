# Project Flashcard
By: Noel Nimstad

<br>
<br>

# What Is This?

Project Flashcard is a SRS system similair to anki that gives you reviews periodically to make sure that an item sticks in your long term memory. Project Flashcard also includes a quick review mode that can help you cram items into your short term memory as well which can be good for quick cramming before an exam.

<br>

# Data Storage

Project Flashcard currently stores your data in localstorage which *isn't reccomended* because if a user clears their localstorage, then everything they've been working on get's wiped. Therefore i implemented a backup option which encodes your save data to b64 and then copies it to your clipboard where you can store it somewhere safe, with this if you localstorage gets wiped, you can rollback through the backup system.