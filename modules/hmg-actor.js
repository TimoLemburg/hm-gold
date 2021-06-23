export class HMGActor {
    static prepareBaseData(actor) {
        const data = actor.data.data;
        const eph = data.eph;
        foundry.utils.setProperty(data, "abilities.speed.base", actor.getFlag('hm-gold', 'speed') || 0);
        foundry.utils.setProperty(data, "abilities.touch.base", actor.getFlag('hm-gold', 'touch') || 0);
        foundry.utils.setProperty(data, "abilities.frame.base", actor.getFlag('hm-gold', 'frame') || 0);
        foundry.utils.setProperty(data, "abilities.endurance.base", actor.getFlag('hm-gold', 'endurance') || 0);
        data.abilities.speed.effective = 0;
        data.abilities.touch.effective = 0;
        data.abilities.frame.effective = 0;
        data.abilities.endurance.effective = 0;
        data.eph.speed = data.abilities.speed.base;
        data.eph.touch = data.abilities.touch.base;
        data.eph.frame = data.abilities.frame.base;
        data.eph.endurance = data.abilities.endurance.base;
    }

    static prepareDerivedData(actor) {
        const actorData = actor.data;
        const data = actorData.data;
        const eph = data.eph;

        // The following calculations are different for HM Gold
        data.condition = Math.max(data.condition - data.physicalPenalty, 5);
        eph.stumbleTarget = Math.max(Math.max(data.abilities.agility.effective, data.dodge) - data.physicalPenalty, 5);
        eph.fumbleTarget = Math.max((data.abilities.dexterity.effective * 5) - data.physicalPenalty, 5)

        // In HMG abilities are not affected by physical or universal penalty
        data.abilities.strength.effective = eph.strength;
        data.abilities.stamina.effective = eph.stamina;
        data.abilities.agility.effective = eph.agility;
        data.abilities.dexterity.effective = eph.dexterity;
        data.abilities.eyesight.effective = eph.eyesight;
        data.abilities.hearing.effective = eph.hearing;
        data.abilities.smell.effective = eph.smell;
        data.abilities.voice.effective = eph.voice;
        data.abilities.intelligence.effective = eph.intelligence;
        data.abilities.aura.effective = eph.aura;
        data.abilities.will.effective = eph.will;
        data.abilities.comeliness.effective = eph.comeliness;
        data.abilities.morality.effective = eph.morality;
        data.abilities.endurance.effective = eph.endurance;
        data.abilities.speed.effective = eph.speed;
        data.abilities.touch.effective = eph.touch;
        data.abilities.frame.effective = eph.frame;

    }

    static calcShockIndex(actor) {
        actor.data.data.shockIndex.value = 100;
    }

    static calcUniversalPenalty(actor) {
        actor.data.data.universalPenalty = 0;
    }

    static calcPhysicalPenalty(actor) {
        actor.data.data.physicalPenalty = actor.data.data.eph.totalInjuryLevels + actor.data.data.eph.fatigue;
    }

    static actorRenderFix(actorSheet, html, data) {
        const actor = actorSheet.actor;
        const origData = data;
        data = origData.data;

        html.find('div.stat').remove();     // Remove Universal Penalty
        html.find('div.endurance').remove() // Remove Shock Index
        html.find('div.endbar').remove()    // Remove Shock Index bar
        html.find('li.move').remove();     // Remove "move" field
        html.find('ul.ability-scores li[data-ability="will"]').after(`
                    <li class="ability" data-ability="endurance">
                        <h4 class="ability-name box-title rollable">Endurance</h4>
                        <h3 class="ability-value">${data.abilities.endurance.effective}</h3>
                        <div class="ability-modifiers flexrow">
                            <div class="item-dice">
                                <a class="ability-d6-roll" data-ability="endurance" title="d6 Endurance Roll"><i
                                        class="fas fa-dice-d6"></i></a>
                            </div>
                            <div class="ability-box">
                                <input class="ability-base" type="number" name="flags.hm-gold.endurance"
                                    value="${data.abilities.endurance.base}" data-dtype="Number" />
                            </div>
                            <div class="item-dice">
                                <a class="ability-d100-roll" data-ability="endurance" title="d100 Endurance Roll"><i
                                        class="fas fa-dice-d20"></i></a>
                            </div>
                        </div>
                    </li>
                    <li class="ability" data-ability="speed">
                        <h4 class="ability-name box-title rollable">Speed</h4>
                        <h3 class="ability-value">${data.abilities.speed.effective}</h3>
                        <div class="ability-modifiers flexrow">
                            <div class="item-dice">
                                <a class="ability-d6-roll" data-ability="speed" title="d6 Speed Roll"><i
                                        class="fas fa-dice-d6"></i></a>
                            </div>
                            <div class="ability-box">
                                <input class="ability-base" type="number" name="flags.hm-gold.speed"
                                    value="${data.abilities.speed.base}" data-dtype="Number" />
                            </div>
                            <div class="item-dice">
                                <a class="ability-d100-roll" data-ability="speed" title="d100 Speed Roll"><i
                                        class="fas fa-dice-d20"></i></a>
                            </div>
                        </div>
                    </li>`);
        html.find('ul.ability-scores li[data-ability="voice"]').after(`
                    <li class="ability" data-ability="touch">
                        <h4 class="ability-name box-title rollable">Touch</h4>
                        <h3 class="ability-value">${data.abilities.touch.effective}</h3>
                        <div class="ability-modifiers flexrow">
                            <div class="item-dice">
                                <a class="ability-d6-roll" data-ability="touch" title="d6 Touch Roll"><i
                                        class="fas fa-dice-d6"></i></a>
                            </div>
                            <div class="ability-box">
                                <input class="ability-base" type="number" name="flags.hm-gold.touch"
                                    value="${data.abilities.touch.base}" data-dtype="Number" />
                            </div>
                            <div class="item-dice">
                                <a class="ability-d100-roll" data-ability="touch" title="d100 Touch Roll"><i
                                        class="fas fa-dice-d20"></i></a>
                            </div>
                        </div>
                    </li>
                    <li class="ability" data-ability="frame">
                        <h4 class="ability-name box-title rollable">Frame</h4>
                        <h3 class="ability-value">${data.abilities.frame.effective}</h3>
                        <div class="ability-modifiers flexrow">
                            <div class="item-dice">
                                <a class="ability-d6-roll" data-ability="frame" title="d6 Frame Roll"><i
                                        class="fas fa-dice-d6"></i></a>
                            </div>
                            <div class="ability-box">
                                <input class="ability-base" type="number" name="flags.hm-gold.frame"
                                    value="${data.abilities.frame.base}" data-dtype="Number" />
                            </div>
                            <div class="item-dice">
                                <a class="ability-d100-roll" data-ability="frame" title="d100 Frame Roll"><i
                                        class="fas fa-dice-d20"></i></a>
                            </div>
                        </div>
                    </li>`);

        // Remove un-useful encumbrance and endurance values (endurance especially is confusing)
        html.find('#combat-stat-encumbrance').empty();
        html.find('#combat-stat-endurance').empty();

        // In the following section, we add the "Squeeze" and "Tear" fields to each of the
        // weapons in the weapon list.
        // First, we add the headers
        html.find('li.items-header.weapon div.weapon-piercing').after(`
                    <div class="item-detail weapon-piercing">S</div>
                    <div class="item-detail weapon-piercing">T</div>`);
        // Next, we add the squeeze and tear values to each of the weapons
        html.find('ol.weapon-list').children().each((index, weapon) => {
            const wpnItem = actor.items.get(weapon.getAttribute('data-item-id'));
            const data = wpnItem.data.data;
            let node = $(weapon).children('.weapon-piercing').first();

            // Add Squeeze impact to weapon
            const squeezeImpact = wpnItem.getFlag('hm-gold', 'squeeze') || 0;
            let squeezeContent = '';
            if (squeezeImpact < 0) {
                squeezeContent = `<div class="item-detail weapon-piercing"><i class="fas fa-times"></i></div>`;
            } else {
                const isActive = data.isEquipped && data.isCarried;
                if (isActive) {
                    squeezeContent = `
                            <div class="item-detail weapon-piercing active">
                                <a class="weapon-damage-roll"
                                        title="${wpnItem.data.name} Squeeze Damage Roll" data-weapon="${wpnItem.data.name}"
                                        data-aspect="Squeeze">${squeezeImpact}</a>
                            </div>`;
                } else {
                    squeezeContent = `<div class="item-detail weapon-piercing">${squeezeImpact}</div>`;
                }
            }

            // Add Tear impact to weapon
            const tearImpact = wpnItem.getFlag('hm-gold', 'tear') || 0;
            let tearContent = '';
            if (tearImpact < 0) {
                tearContent = `<div class="item-detail weapon-piercing"><i class="fas fa-times"></i></div>`;
            } else {
                const isActive = data.isEquipped && data.isCarried;
                if (isActive) {
                    tearContent = `
                            <div class="item-detail weapon-piercing active">
                                <a class="weapon-damage-roll"
                                        title="${wpnItem.data.name} Tear Damage Roll" data-weapon="${wpnItem.data.name}"
                                        data-aspect="Tear">${tearImpact}</a>
                            </div>`;
                } else {
                    tearContent = `<div class="item-detail weapon-piercing">${tearImpact}</div>`;
                }
            }

            node.after(squeezeContent, tearContent);
        });

        // In the following section, we add the additional HMG ranges to the missiles
        // First, we add the headers
        html.find('li.items-header.missile div.missile-short').text('4');
        html.find('li.items-header.missile div.missile-medium').text('8');
        html.find('li.items-header.missile div.missile-long').text('16');
        html.find('li.items-header.missile div.missile-extreme').text('32').after(
           '<div class="item-detail missile-extreme">64</div>',
           '<div class="item-detail missile-extreme">128</div>',
           '<div class="item-detail missile-extreme">256</div>');

        // Next, we add the ranges to each of the missiles
        html.find('ol.missile-list li.missile').each((index, missile) => {
            const mslItem = actor.items.get(missile.getAttribute('data-item-id'));
            const data = mslItem.data.data;
            let node = $(missile).children('.missile-extreme').first();

            // Add Extreme64 impact to missile
            const extreme64Impact = mslItem.getFlag('hm-gold', 'extreme64-impact') || 0;
            const extreme64Range = mslItem.getFlag('hm-gold', 'extreme64-range') || 0;
            let extreme64Content = "";
            if (extreme64Range < 0) {
                extreme64Content = `<div class="item-detail missile-extreme"><i class="fas fa-times"></i></div>`;
            } else {
                const isActive = data.isEquipped && data.isCarried;
                if (isActive) {
                    extreme64Content = `
                        <div class="item-detail missile-extreme active">
                            <a class="missile-damage-roll"
                                    title="${mslItem.data.name}} 64-Range Damage Roll"
                                    data-weapon="${mslItem.data.name}"
                                    data-range="Extreme64">${extreme64Range}/${extreme64Impact}</a></div>`;
                } else {
                    extreme64Content = `<div class="item-detail missile-extreme">${extreme64Range}/${extreme64Impact}</div>`;
                }
            }

            // Add Extreme128 impact to missile
            const extreme128Impact = mslItem.getFlag('hm-gold', 'extreme128-impact') || 0;
            const extreme128Range = mslItem.getFlag('hm-gold', 'extreme128-range') || 0;
            let extreme128Content = '';
            if (extreme128Range < 0) {
                extreme128Content = `<div class="item-detail missile-extreme"><i class="fas fa-times"></i></div>`;
            } else {
                const isActive = data.isEquipped && data.isCarried;
                if (isActive) {
                    extreme128Content = `
                        <div class="item-detail missile-extreme active">
                            <a class="missile-damage-roll"
                                    title="${mslItem.data.name}} 128-Range Damage Roll"
                                    data-weapon="${mslItem.data.name}"
                                    data-range="Extreme128">${extreme128Range}/${extreme128Impact}</a></div>`;
                } else {
                    extreme128Content = `<div class="item-detail missile-extreme">${extreme128Range}/${extreme128Impact}</div>`;
                }
            }

            // Add Extreme256 impact to missile
            const extreme256Impact = mslItem.getFlag('hm-gold', 'extreme256-impact') || 0;
            const extreme256Range = mslItem.getFlag('hm-gold', 'extreme256-range') || 0;
            let extreme256Content = '';
            if (extreme256Range < 0) {
                extreme256Content = `<div class="item-detail missile-extreme"><i class="fas fa-times"></i></div>`;
            } else {
                const isActive = data.isEquipped && data.isCarried;
                if (isActive) {
                    extreme256Content = `
                        <div class="item-detail missile-extreme active">
                            <a class="missile-damage-roll"
                                    title="${mslItem.data.name}} 256-Range Damage Roll"
                                    data-weapon="${mslItem.data.name}"
                                    data-range="Extreme256">${extreme256Range}/${extreme256Impact}</a></div>`;
                } else {
                    extreme256Content = `<div class="item-detail missile-extreme">${extreme256Range}/${extreme256Impact}</div>`;
                }
            }

            node.after(extreme64Content, extreme128Content, extreme256Content);
        });

        // Change the injury severity field's header to "IP" (for injury points)
        html.find('li.items-header div.injury-severity').text('IP');

        // In the following section, we add the "Squeeze" and "Tear" fields to each of the
        // armorlocations in the armorlocations list.
        // First, we add the headers
        html.find('li.items-header.armorlocation div.armorlocation-fire').after(`
                    <div class="item-detail armorlocation-fire">S</div>
                    <div class="item-detail armorlocation-fire">T</div>`);
        // Next, we add the squeeze and tear values to each of the armorlocations
        html.find('ol.armorlocation-list').children().each((index, armorlocation) => {
            const alItem = actor.items.get(armorlocation.getAttribute('data-item-id'));
            const data = alItem.data.data;
            let node = $(armorlocation).children('.armorlocation-fire').first();

            // Add Squeeze impact to armorlocation
            const squeezeArmor = alItem.getFlag('hm-gold', 'squeeze') || 0;
            let squeezeContent = `<div class="item-detail armorlocation-fire">${squeezeArmor}</div>`;

            // Add Tear impact to armorlocation
            const tearArmor = alItem.getFlag('hm-gold', 'tear') || 0;
            let tearContent = `<div class="item-detail armorlocation-fire">${tearArmor}</div>`;

            node.after(squeezeContent, tearContent);
        });

        // Fix On-Person Container Capacity
        const onPersonContainer = origData.containers['on-person'];
        const capacityVal = onPersonContainer.data.data.capacity.value;
        html.find('li[data-container-id="on-person"] div.gear-capacity').text(`Capacity: ${capacityVal}`);
    }
}
