- BIG CLEANUP:

  -check if with new setup audio is not cut too fast without the fading out places

  - EVERYTHING CHANGES:
    - Adjacent places instead of muffled places
    - Just one activePlace in global status context
    - no audio manager, places and moods are components in place badges
    - the state of each badge is stored in the main context so functions that modify state like switchState, changeSound, etc does not have to be transmitted through props
  - Use context api or redux for state instead of passing it as props for infinity
  - Use useEffect to automatically update localStorage
  - Use reduce/redux to add all the security checks on the new state before it is actually saved (solves global state as well!)
  - Use immer to make dictionary state updates cleaner and more concise (without needing to do deep copies each time)

- add activePlace volume

- Eviter de créer nouveau howl pour un son qui recommence (serait-ce plus optimal?) juste recommencer même howl (ne fonctionne que si le temps entre les sons est positif (negatif=overlap->nécessite 2 howls))
- Make a single function for creating howls and add a gain node there
- allow to make sound families (with potential filter to just see some families)
- include stereo options in sound
- create homemade audio preview in soundlist that allows trimming and that plays api urls as well
- Add images for places (and moods?) the place images each have checks for each biome (like for sounds)
- Add info tooltips for everything
- When a transition happens, try to fade from low lowpass filter to high lowpass filter instead of progressively increasing lowpass (requires a new copy of sound and syncing the copy with original (not sure if possible))
  (- better below (secretly divide volume_mul by two (a 1 actually means 0.5, and is the default) that way sounds can be made "louder")
- make all howls go through a gain filter that has a gain equal to the sound's volume_mul) supposedly not necessary since I removed html5
- make sure every function got adapted to the arrival of weathers and moods (ex: change sound)
- make sure that audio is updated on every click (especially weather change)
- utiliser sound_list pour mood? (avec premier sound qui correspond aux circonstances qui joue)
- use frontend alternative to ytdl-core (youtube to mp3 api, play api?, avoid it all together?)
- Make promptEdit give suggestions and only allow suggestions (10 min)
- make one sound-pack per biome? (automatically remove biome from other soundpack when biome activated on new soundpack)(if a biome is not activated in any soundpack, that biome doesn't play anything for that sound)
- Solve why sound stops if running when switching day time
- make sounds trimmable (4h)
- make biomes weather probability (markhov chain?)
- make auto weather button that, when activated, changes the weather everytime the timeofday changes (and less likely change when place changes?)
- change Icon (10min)
- add wind intensity for weather (and minimal wind intensity to sounds in place soundlist)
- solving glitch problem
- solve all sounds problem
- add transition sound (with "transition" button):
  - long transition:
    - with sound => footsteps (sounds depending on start place and arrival place)
    - without sound
  - short transition:
    - with sound => (play arrival transition sound of arrival place (and departure sound of leaving place?))
    - without sound
- for long transitions use stereo to fake things moving?
- clean everything by making classes instead of everything in one big dictionary
