/* The Strand's bill: what plays in the picture house on Central Avenue.

   One line a reel, for example:
     { title: "Beach 20th, 1962", by: "Home movie", yt: "https://youtu.be/...", file: "media/beach20.mp4", mins: 3 },

     title   what the ticket says (the posters out front show the first 16 letters or so)
     by      a second line on the ticket
     yt      a YouTube link, pasted as it comes, or the video's id
     file    a house copy: a file beside this one ("media/reel.mp4") or a full https address.
             A list of files is tried in order. .mp4 (H.264 + AAC) plays everywhere.
     start   seconds in to begin;  end  seconds in to stop (YouTube only)
     mins    the running time printed on the ticket

   A reel needs a yt or a file. YouTube is tried first, then the house copy, then the Rockaway
   Newsreel, which the game draws itself: it is always reel 1 and needs no line here.
   The show runs in this order and each reel hands on to the next: the newsreel, the two
   previews, then the feature, and round again. */
window.STRAND_BILL = [
  /* previews before the movie */
  { title: "Subway Stop in VR", by: "Preview · Why I rebuilt my favorite Brooklyn subway stop",
    yt: "https://youtu.be/wOtfw7sQHZ8" },
  { title: "Potion Panic", by: "Preview · Made in Brooklyn Games",
    yt: "https://youtu.be/oLidrV_JSlg" },
  /* the feature */
  { title: "Museum Multiverse", by: "Feature presentation · the trailer",
    yt: "https://youtu.be/MF46EPlngic", mins: 2 }
];

/* ------------------------------------------------------------------------------------------
   Two switches for the game (Place of Sands 1.0). Each is one line.
   1 is OFF until Kings County Lanes is live: take the two slashes off the front of its line.
   2 is OFF: take the two slashes off the front of its last line and put your code in.
   ------------------------------------------------------------------------------------------ */

/* 1. THE A AFTER THE ENDING. Once the glass is set and the card is closed, the A comes back to
      Mott Avenue and its door is a ride to your next game: name it and say where it lives.
      Without this line there is no ride and the train stays away, as before: to switch the
      ride off, put two slashes in front of the line.
        name  what the car's sign and the hint say (up to 40 letters)
        url   the game's full web address, https and all; it opens in a new tab
      The address must be live before this file goes up, or the ride lands on a missing page.    */
// window.POS_TRAIN = { name: "Kings County Lanes", url: "https://hessvacio.com/pages/kings-county-lanes/" };

/* 2. PLAY COUNTS. The game says on the page what happened: start, resume, glass 1 to 8, finish,
      share, ride. It sends nothing anywhere and says nothing about who is playing. This passes
      each of those on to a GoatCounter site of yours as an event (pos-start, pos-glass-3,
      pos-finish ...), and GoatCounter's own script counts the visit. No cookies.
      Put your GoatCounter site code in place of YOURCODE.                                      */
function posCounts(code) {
  var q = [], s = document.createElement("script");
  s.async = true; s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
  document.head.appendChild(s);
  function flush() {
    if (!(window.goatcounter && window.goatcounter.count)) return;
    while (q.length) window.goatcounter.count({ path: q.shift(), event: true });
  }
  window.addEventListener("placeofsands", function (e) {
    var d = e.detail || {};
    if (!d.event) return;
    q.push("pos-" + d.event + (d.event === "glass" ? "-" + d.n : ""));
    if (q.length > 40) q.shift();
    flush();
  });
  setInterval(flush, 1500);
}
// posCounts("YOURCODE");
