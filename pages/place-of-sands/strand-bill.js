/* The Strand's bill: what plays in the picture house on Central Avenue.

   One line a reel, for example:
     { title: "Beach 20th, 1962", by: "Home movie", yt: "https://youtu.be/...", file: "media/beach20.mp4", mins: 3 },

     title   what the ticket says
     by      a second line on the ticket
     yt      a YouTube link, pasted as it comes, or the video's id
     file    a house copy: a file beside this one ("media/reel.mp4") or a full https address.
             A list of files is tried in order. .mp4 (H.264 + AAC) plays everywhere.
     start   seconds in to begin;  end  seconds in to stop (YouTube only)
     mins    the running time printed on the ticket

   A reel needs a yt or a file. YouTube is tried first, then the house copy, then the Rockaway
   Newsreel, which the game draws itself: it is always reel 1 and needs no line here.
   Leave the list empty and the house shows the newsreel alone. */
window.STRAND_BILL = [
];
