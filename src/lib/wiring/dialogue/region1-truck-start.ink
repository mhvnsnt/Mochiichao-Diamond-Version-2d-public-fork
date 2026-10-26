VAR clock_set = false
VAR codex_get = false
VAR sprint_boots = false

-> mom_truck

=== mom_truck ===
Mom: There you are! The truck beat us here.
Mom: Our new house is just up the road. Go on in and set the clock upstairs — movers hate waiting.
-> house_1f

=== house_1f ===
Mover: Careful with that box! It's got your posters in it.
Mover: The stairs are right there. Clock's upstairs.
-> house_2f_clock

=== house_2f_clock ===
You set the clock on the wall. It ticks, once, and keeps going.
~ clock_set = true
You: Home. For real this time.
-> rival_house

=== rival_house ===
Hex's Mom: Oh! You're the new neighbours! Hex is out back — go say hello, you two will be thick as thieves.
-> route_rescue

=== route_rescue ===
Prof. Aeon: Help! This wild creature has me cornered!
Prof. Aeon: Quick — take one from my bag and drive it off!
* [Take Mochii] -> lab
* [Take Razorgater] -> lab
* [Take Tyrage] -> lab
* [Take Kittember] -> lab
* [Take Sproutle] -> lab

=== lab ===
Prof. Aeon: Phew. Thank you. That bag is yours to keep, and so is the creature inside it.
Prof. Aeon: This is your Codex. It records every Mochiichao you meet.
~ codex_get = true
Prof. Aeon: Now go — Route 1.0 is waiting, and Silicon Town is just past it.
-> mom_boots

=== mom_boots ===
Mom: Off already? Here — Sprint Boots. They'll get you there twice as fast.
~ sprint_boots = true
Mom: Come back and talk to me any time — I'll patch your partner right up.
-> END
