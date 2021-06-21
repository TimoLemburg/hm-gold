Hooks.on('renderHarnMasterActor', (actor, html, data) => {
    // Using 'html' object, manipulate HTML form dynamically
});

Hooks.on('hm3.preMeleeAttack', (combatant, targetToken, weapon) => {
    ui.notifications.warn('Automated Combat not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preMissileAttack', (combatant, targetToken, missile) => {
    ui.notifications.warn('Automated Combat not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preMeleeCounterstrikeResume', (atkToken, defToken, atkWeaponName, atkEffAML, atkAim, atkAspect, atkImpactMod) => {
    ui.notifications.warn('Automated Combat not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preDodgeResume', (atkToken, defToken, type, weaponName, effAML, aim, aspect, impactMod) => {
    ui.notifications.warn('Automated Combat not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preBlockResume', (atkToken, defToken, type, weaponName, effAML, aim, aspect, impactMod) => {
    ui.notifications.warn('Automated Combat not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preIgnoreResume', (atkToken, defToken, type, weaponName, effAML, aim, aspect, impactMod) => {
    ui.notifications.warn('Automated Combat not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preMissileDamageRoll', (rollData, actor) => {
    return true;
});

Hooks.on('hm3.preWeaponAttackRoll', (stdRollData, actor, weapon) => {
    return true;
});

Hooks.on('hm3.preWeaponDefendRoll', (stdRollData, actor, weapon) => {
    return true;
});

Hooks.on('hm3.preMissileAttackRoll', (rollData, actor, weapon) => {
    return true;
});

Hooks.on('hm3.preInjuryRoll', (rollData, actor) => {
    return true;
});

Hooks.on('hm3.preHealingRoll', (stdRollData, actor, injury) => {
    ui.notifications.warn('Healing rolls not available in HarnMaster Gold Mode');
    return false;
});

Hooks.on('hm3.preShockRoll', (stdRollData, actor) => {
    // In HMG, shock roll target is the Condition skill value,
    // and we roll a d100 instead of a d6
    stdRollData.target = actor.data.data.condition;
    game.hm3.DiceHM3.d100StdRoll(stdRollData).then(result => {
        // Don't forget to run any custom macros when the roll is complete!
        actor.runCustomMacro(result);
    });
    return false;  // abandon any further processing
});

