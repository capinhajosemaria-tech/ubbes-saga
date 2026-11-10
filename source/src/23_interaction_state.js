/* =================== interaction state =================== */
let mode='view';   /* view | place | road | erase */
let place=null;    /* {t, rot, moving:b} */
let sel=null;      /* {b} or {x,y} */
