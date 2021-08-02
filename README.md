# H&acirc;rnMaster Gold
H&acirc;rnMaster Gold module for Foundry VTT

This module modifies the [H&acirc;rnMaster 3](https://foundryvtt.com/packages/hm3) system for Foundry VTT
to enable users to use the H&acirc;rnMaster Gold rules.  This is a basic (and still experimental) implementation
of the H&acirc;rnMaster Gold rules.  In particular, Automated Combat is not implemented and has been disabled.

Since this module is not designed to stand on its own, please see the main page for the H&acirc;rnMaster 3 system
for details on how to use this.

Specific Differences from HM3:
* No Universal Penalty
* Attributes not affected by Physical Penalty
* Touch, Endurance, Speed, and Frame attributes are added.
* Squeeze and Tear aspects have been added to weapons, missiles, and armor.
* Missile attacks and missile defense have been substantially altered to fit HMG rules.
* Condition is used for most purposes that Endurance is used in HM3

Planned next steps:
* Change to Missile Weapon template to allow for Impact with percent values
* Weapon Data - only missing thrown missile weapons due to needed backend change
* Magic Spells
* Encounter Generation/Lists (maybe...)
* Treasure Generation/Lists (maybe...)

Release Notes:
* v0.1.2.3 (2021-08-02) - Added Psionics, new Default Skill "Spirit" and Roll Tables for Psionics, Medical Disorders and Psyche
* v0.1.2.2 (2021-07-31) - Fixed item error with double entries for all "items" in Character Sheet, fixed the Craft & Lore Skill List and corrected the Fumble & Stumble Roll calculation
* v0.1.2.1 (2021-07-11) - Added default HMG skills for new character creation, fixing some typos
* v0.1.2 (2021-07-11) - Added Skills, Ritual Invocations, Weapons (only some Missile Weapons missing due to neccessary changes), Armour Data