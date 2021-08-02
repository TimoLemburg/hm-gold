import { HMGActor } from './modules/hmg-actor.js';
import { HMGItem } from './modules/hmg-item.js';
import { HMGDice } from './modules/hmg-dice.js';
import { FurnacePatching } from './modules/Patches.js';

//CONFIG.debug.hooks = true;

// re-enable listeners
function reEnableListeners(sheet, html) {
    html.find("*").off();
    sheet.activateListeners(html);
    // re-enable core listeners (for drag & drop)
    //sheet._activateCoreListeners(html);
}

Hooks.once('init', async () => {
    // Add additional HMG aspects
    game.hm3.config.allowedAspects = game.hm3.config.allowedAspects.concat(['Squeeze', 'Tear']);

    // Add additional HMG ranges
    game.hm3.config.allowedRanges = ['4-hex', '8-hex', '16-hex', '32-hex', '64-hex', '128-hex', '256-hex'];

    // Set default skills for Characters and Creatures, including adding Condition
    delete game.hm3.config.defaultCharacterSkills['hm3.std-skills-physical']
    game.hm3.config.defaultCharacterSkills['hm-gold.hmg-skills-physical'] = ['CLIMBING', 'CONDITION', 'JUMPING', 'MOBILITY', 'STEALTH', 'THROWING'];
    delete game.hm3.config.defaultCharacterSkills['hm3.std-skills-communication']
    game.hm3.config.defaultCharacterSkills['hm-gold.hmg-skills-communication'] = ['AWARENESS', 'INTRIGUE', 'ORATORY', 'RHETORIC', 'SINGING', "LANGUAGE: NATIVE"];
    delete game.hm3.config.defaultCharacterSkills['hm3.std-skills-combat']
    game.hm3.config.defaultCharacterSkills['hm-gold.hmg-skills-combat'] = ['DODGE', 'INITIATIVE', 'UNARMED'];
    game.hm3.config.defaultCharacterSkills['hm-gold.hmg-psionics'] = ['SPIRIT'];
    

    delete game.hm3.config.defaultCreatureSkills['hm3.std-skills-communication'];
    game.hm3.config.defaultCreatureSkills['hm-gold.hmg-skills-communication'] = ['AWARENESS'];
    delete game.hm3.config.defaultCreatureSkills['hm3.std-skills-combat'];
    game.hm3.config.defaultCreatureSkills['hm-gold.hmg-skills-combat'] = ['DODGE', 'INITIATIVE', 'UNARMED'];
    game.hm3.config.defaultCreatureSkills['hm-gold.hmg-skills-physical'] = ['CLIMBING', 'CONDITION', 'JUMPING', 'MOBILITY', 'STEALTH', 'THROWING'];
    game.hm3.config.defaultCreatureSkills['hm-gold.hmg-psionics'] = ['SPIRIT'];
    

    // Remove "Universl Penalty" from Active Effects dropdown list
    delete game.hm3.config.activeEffectKey['data.universalPenalty'];

    // Replace some overriden methods
    FurnacePatching.replaceFunction(game.hm3.HarnMasterActor, "calcUniversalPenalty", HMGActor.calcUniversalPenalty);
    FurnacePatching.replaceFunction(game.hm3.HarnMasterActor, "calcPhysicalPenalty", HMGActor.calcPhysicalPenalty);
    FurnacePatching.replaceFunction(game.hm3.HarnMasterActor, "calcShockIndex", HMGActor.calcShockIndex);

    FurnacePatching.replaceFunction(game.hm3.HarnMasterItem, "calcInjurySeverity", HMGItem.calcInjurySeverity);
    FurnacePatching.replaceFunction(game.hm3.HarnMasterItem, "calcPenaltyPct", HMGItem.calcPenaltyPct);

    FurnacePatching.replaceFunction(game.hm3.DiceHM3, "calcWeaponAspect", HMGDice.calcWeaponAspect);
    FurnacePatching.replaceFunction(game.hm3.DiceHM3, "missileAttackDialog", HMGDice.missileAttackDialog);
});

Hooks.on('renderHarnMasterCharacterSheet', (actorSheet, html, data) => {
    HMGActor.actorRenderFix(actorSheet, html, data);
    reEnableListeners(actorSheet, html);
    return true;
});

Hooks.on('renderHarnMasterCreatureSheet', (actorSheet, html, data) => {
    HMGActor.actorRenderFix(actorSheet, html, data);
    reEnableListeners(actorSheet, html);
    return true;
});

Hooks.on('renderHarnMasterItemSheet', (itemSheet, html, data) => {
    const item = itemSheet.item;
    switch (item.data.type) {
        case 'armorgear':
            HMGItem.armorgearRenderFix(itemSheet, html, data);
            return true;;

        case 'armorlocation':
            HMGItem.armorlocationRenderFix(itemSheet, html, data);
            return true;;

        case 'injury':
            HMGItem.injuryRenderFix(itemSheet, html, data);
            return true;;

        case 'missilegear':
            HMGItem.missilegearRenderFix(itemSheet, html, data);
            return true;;

        case 'weapongear':
            HMGItem.weapongearRenderFix(itemSheet, html, data);
            return true;;
    }
});

Hooks.on('hm3.preMissileAttackRoll', (rollData, actor, missile) => {
    rollData.missile = missile;
    return true;
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

Hooks.on('hm3.preMissileDamageRoll', (rollData, actor, missile) => {
    HMGDice.missileDamageRoll(rollData, missile);
    return false;  // abandon any further processing
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

Hooks.on('hm3.preStumbleRoll', (stdRollData, actor) => {
    game.hm3.DiceHM3.d100StdRoll(stdRollData).then(result => {
        // Don't forget to run any custom macros when the roll is complete!
        actor.runCustomMacro(result);
    });
   
    return false;  // abandon any further processing
});

Hooks.on('hm3.preFumbleRoll', (stdRollData, actor) => {
    game.hm3.DiceHM3.d100StdRoll(stdRollData).then(result => {
        // Don't forget to run any custom macros when the roll is complete!
        actor.runCustomMacro(result);
    });
   
    return false;  // abandon any further processing
});

Hooks.on('hm3.onActorPrepareBaseData', (actor) => HMGActor.prepareBaseData(actor) );
Hooks.on('hm3.onActorPrepareDerivedData', (actor) => HMGActor.prepareDerivedData(actor) );
