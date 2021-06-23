import { HMGActor } from './modules/hmg-actor.js';
import { HMGItem } from './modules/hmg-item.js';
import { FurnacePatching } from './modules/Patches.js';

class HMGold {
    constructor() {
        Hooks.on('init', this.init.bind(this));
        Hooks.on('ready', this.ready.bind(this));
    }

    init() {
       // Add additional HMG aspects
       game.hm3.config.allowedAspects = game.hm3.config.allowedAspects.concat(['Squeeze', 'Tear']);

       // Add additional HMG ranges
       game.hm3.config.allowedRanges = game.hm3.config.allowedRanges.concat(['Extreme64', 'Extreme128', 'Extreme256']);

       // Remove "Universl Penalty" from Active Effects dropdown list
       delete game.hm3.config.activeEffectKey['data.universalPenalty'];

       // Replace some overriden methods
       FurnacePatching.replaceFunction(game.hm3.HarnMasterActor, "calcUniversalPenalty", HMGActor.calcUniversalPenalty);
       FurnacePatching.replaceFunction(game.hm3.HarnMasterActor, "calcPhysicalPenalty", HMGActor.calcPhysicalPenalty);
       FurnacePatching.replaceFunction(game.hm3.HarnMasterActor, "calcShockIndex", HMGActor.calcShockIndex);

       FurnacePatching.replaceFunction(game.hm3.HarnMasterItem, "calcInjurySeverity", HMGItem.calcInjurySeverity);
       FurnacePatching.replaceFunction(game.hm3.HarnMasterItem, "calcPenaltyPct", HMGItem.calcPenaltyPct);
    }

    ready() {
    }
}

CONFIG.debug.hooks = true;
new HMGold();


Hooks.on('renderHarnMasterCharacterSheet', (actorSheet, html, data) => {
    HMGActor.actorRenderFix(actorSheet, html, data);
    return true;
});

Hooks.on('renderHarnMasterCreatureSheet', (actorSheet, html, data) => {
    HMGActor.actorRenderFix(actorSheet, html, data);
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
    rollData.impactExtreme64 = missile.getFlag('hmg', 'impactExtreme64');
    rollData.impactExtreme128 = missile.getFlag('hmg', 'impactExtreme128');
    rollData.impactExtreme256 = missile.getFlag('hmg', 'impactExtreme256');
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

Hooks.on('hm3.preStumbleRoll', (stdRollData, actor) => {
    game.hm3.DiceHM3.d100StdRoll(stdRollData).then(result => {
        // Don't forget to run any custom macros when the roll is complete!
        actor.runCustomMacro(result);
        game.hm3.macros.callOnHooks("hm3.onStumbleRoll", actor, result, stdRollData);
    });
   
    return false;  // abandon any further processing
});

Hooks.on('hm3.preFumbleRoll', (stdRollData, actor) => {
    game.hm3.DiceHM3.d100StdRoll(stdRollData).then(result => {
        // Don't forget to run any custom macros when the roll is complete!
        actor.runCustomMacro(result);
        game.hm3.macros.callOnHooks("hm3.onStumbleRoll", actor, result, stdRollData);
    });
   
    return false;  // abandon any further processing
});

Hooks.on('preCreateActor', (actor, createData, options, userId) => {
    // only add 'Condition' skill to characters and creatures
    if (['character', 'creature'].includes(createData.type)) {
        game.packs
            .get('hm3.std-skills-physical')
            .getDocuments()
            .then((result) => {
                let chain = Promise.resolve()
                result.forEach(async (ability, index) => {
                    chain = await chain.then(async () => {
                        if (['Condition'].includes(ability.name)) {
                            const updateData = { items: [ ability.data ] };
                            await actor.data.update(updateData);
                        }
                    });
                });
            });
    }
});

Hooks.on('hm3.onActorPrepareBaseData', (actor) => HMGActor.prepareBaseData(actor) );
Hooks.on('hm3.onActorPrepareDerivedData', (actor) => HMGActor.prepareDerivedData(actor) );
