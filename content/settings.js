/* =====================================================================
   ✎  SETTINGS  —  your personal details & wording
   ---------------------------------------------------------------------
   This is the ONLY file (besides letters.js and the photo) you need to
   edit to personalise the front page.

   HOW TO EDIT
   • Change only the text between the "quote marks".
   • Do NOT delete the quote marks, the commas at the end of each line,
     or the word on the left of each colon (e.g. "greeting:").
   • If you want a quote mark INSIDE your text, write it as \"  (backslash first).
   • Save the file, then refresh the website in your browser.
   ===================================================================== */

const SETTINGS = {

  /* ---------- 1. THE BROWSER TAB TITLE ---------- */
  pageTitle: "Twenty-Three Letters",


  /* ---------- 2. THE PHOTOGRAPH ----------
     Put your photo in the "images" folder and name it  birthday-person.jpg
     (that is all you need to do — see READ-ME-FIRST.md).
     Only change the line below if your file has a different name.        */
  photo: "images/birthday-person.jpg",

  /* A short description of the photo (for screen readers). */
  photoAlt: "A portrait of the birthday person",

  /* Which part of the photo stays visible when it is cropped into the arch.
     "50% 30%" = centred sideways, a little above the middle (good for faces).
     Make the SECOND number smaller (e.g. 15%) to show more of the TOP of the photo,
     or bigger (e.g. 60%) to show more of the BOTTOM.
     Make the FIRST number smaller to show more of the LEFT side, bigger for the RIGHT. */
  photoFocus: "50% 30%",


  /* ---------- 3. THE OPENING SCREEN ---------- */

  /* The big number printed on the little wax seal beside the photo. */
  age: 23,

  /* Small line above the greeting. */
  eyebrow: "Twenty-three years · twenty-three letters",

  /* The big birthday greeting. */
  greeting: "Happy 23rd Birthday",

  /* The name shown under the greeting. Also used on every envelope ("For ...").
     Use a real name, or a pet name such as "My Love". */
  name: "My Dearest",

  /* The short romantic introduction. */
  intro: "Every year of your life deserves a letter. Here are all twenty-three, sealed with love and waiting for you.",

  /* The handwritten words under the big wax seal button. */
  beginText: "break the first seal",


  /* ---------- 4. THE COLLECTION (the page with the 23 envelopes) ---------- */
  collectionLabel: "The Collection",
  collectionTitle: "Twenty-three letters",
  collectionIntro: "One for every year of your life. Open them in any order, as slowly as you like.",

  /* The little counter. {opened} and {total} are filled in automatically. */
  progressText: "{opened} of {total} letters opened",

  /* What is written on each envelope. {name} becomes the name above. */
  envelopeAddress: "For {name}",

  /* Set to true to write each letter's TITLE on its envelope instead of the line above. */
  showTitleOnEnvelope: false,


  /* ---------- 5. INSIDE EVERY LETTER ---------- */

  /* The closing words at the bottom of every letter. */
  signoff: "Forever yours,",

  /* Your name, written in handwriting under the closing words. */
  signature: "زوزتك",

  /* The words next to the little seal that closes a letter. */
  closeText: "fold the letter away",


  /* ---------- 6. THE VERY END OF THE PAGE ---------- */

  /* Always shown at the bottom. */
  footerMessage: "Made with love, just for you.",

  /* Appears softly once every single letter has been opened. */
  allOpenedMessage: "You have opened every letter. Happy birthday.",

  /* The words of the little link that scrolls back to the top. */
  backToTopText: "back to the beginning"

};
