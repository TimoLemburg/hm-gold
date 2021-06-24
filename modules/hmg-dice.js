export class HMGDice {
    /**
     * Returns a structure specifying the default aspect for a weapon, as well as the
     * impact values for all other aspects.  The default aspect is always the aspect
     * with the greatest impact.
     * 
     * @param {*} weapon Name of weapon
     * @param {*} items List of items containing 'weapongear' items.
     */
    static calcWeaponAspect(weapon, items) {
        // Note that although "Fire" is in this list, because it is a
        // type of damage, no normal weapon uses it as its aspect.
        // It is here so that it can be selected (no default impact
        // damage would be specified for that aspect).
        const result = {
            defaultAspect: "Other",
            aspects: {
                "Blunt": 0,
                "Edged": 0,
                "Piercing": 0,
                "Fire": 0,
                "Squeeze": 0,
                "Tear": 0,
                "Other": 0
            }
        }

        // Search for the specified weapon, and then choose the aspect with
        // the greatest impact (this will become the default aspect)
        items.forEach(it => {
            const itemData = it.data;
            if (itemData.type === 'weapongear' && itemData.name === weapon) {
                const squeezeImpact = it.getFlag('hm-gold','squeeze-impact');
                const tearImpact = it.getFlag('hm-gold', 'tear-impact');
                let maxImpact = Math.max(itemData.data.blunt, itemData.data.piercing, itemData.data.edged, 
                    squeezeImpact, tearImpact, 0);
                result.aspects["Blunt"] = itemData.data.blunt;
                result.aspects["Edged"] = itemData.data.edged;
                result.aspects["Piercing"] = itemData.data.piercing;
                result.aspects['Squeeze'] = squeezeImpact;
                result.aspects['Tear'] = tearImpact;
                if (maxImpact === itemData.data.piercing) {
                    result.defaultAspect = "Piercing";
                } else if (maxImpact === itemData.data.edged) {
                    result.defaultAspect = "Edged";
                } else if (maxImpact === itemData.data.blunt) {
                    result.defaultAspect = "Blunt";
                } else if (maxImpact === squeezeImpact) {
                    result.defaultAspect = "Squeeze";
                } else if (maxImpact === tearImpact) {
                    result.defaultAspect = "Tear";
                } else {
                    // This shouldn't happen, but if all else fails, choose "Other"
                    result.defaultAspect = "Other"
                }
            }
        });

        return result;
    }

    static async missileDamageRoll(rollData, missile) {
        const speaker = rollData.speaker || ChatMessage.getSpeaker();

        const ranges = {
            "4-hex": {
                impact: missile.getFlag('hm-gold','range4-impact') || 0,
                modifier: missile.getFlag('hm-gold','range4-modifier') || 0
            },
            "8-hex": {
                impact: missile.getFlag('hm-gold','range8-impact') || 0,
                modifier: missile.getFlag('hm-gold','range8-modifier') || 0
            },
            "16-hex": {
                impact: missile.getFlag('hm-gold','range16-impact') || 0,
                modifier: missile.getFlag('hm-gold','range16-modifier') || 0
            },
            "32-hex": {
                impact: missile.getFlag('hm-gold','range32-impact') || 0,
                modifier: missile.getFlag('hm-gold','range32-modifier') || 0
            },
            "64-hex": {
                impact: missile.getFlag('hm-gold','range64-impact') || 0,
                modifier: missile.getFlag('hm-gold','range64-modifier') || 0
            },
            "128-hex": {
                impact: missile.getFlag('hm-gold','range128-impact') || 0,
                modifier: missile.getFlag('hm-gold','range128-modifier') || 0
            },
            "256-hex": {
                impact: missile.getFlag('hm-gold','range256-impact') || 0,
                modifier: missile.getFlag('hm-gold','range256-modifier') || 0
            }
        }

        const dialogOptions = {
            name: rollData.name,
            ranges: ranges,
            defaultRange: rollData.defaultRange ? rollData.defaultRange : "256-hex",
            data: rollData.data
        };

        // Create the Roll instance
        const roll = await HMGDice.missileDamageDialog(dialogOptions);

        // If user cancelled the roll, then return immediately
        if (!roll) return null;

        // Prepare for Chat Message
        const chatTemplate = 'systems/hm3/templates/chat/missile-damage-card.html';

        let title = "Missile Damage";
        if (rollData.name != "") {
            title = `${rollData.name} Damage`; 
        }

        let rangeImpact = ranges[roll.range].impact || 0;;
        const totalImpact = Number(rangeImpact) + Number(roll.addlImpact) + Number(roll.rollObj.total);

        const notesData = mergeObject(rollData.notesData, {
            actor: speaker.alias,
            aspect: rollData.aspect,
            range: roll.range,
            dice: Number(roll.damageDice),
            impact: rangeImpact,
            addlImpact: roll.addlImpact,
            totalImpact: totalImpact,
            roll: roll.rollObj.total
        });
        const renderedNotes = rollData.notes ? utility.stringReplacer(rollData.notes, notesData) : "";

        const chatTemplateData = {
            title: title,
            aspect: rollData.aspect,
            range: roll.range,
            damageDice: Number(roll.damageDice),
            rangeImpact: rangeImpact,
            addlImpact: roll.addlImpact,
            totalImpact: totalImpact,
            rollValue: roll.rollObj.total,
            notes: renderedNotes,
            roll: roll
        };
        const html = await renderTemplate(chatTemplate, chatTemplateData);

        const messageData = {
            user: game.user.id,
            speaker: speaker,
            content: html.trim(),
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            sound: CONFIG.sounds.dice,
            roll: roll.rollObj
        };

        const messageOptions = {
            rollMode: game.settings.get("core", "rollMode")
        };

        // Create a chat message
        await ChatMessage.create(messageData, messageOptions)
    
        return chatTemplateData;
    }

    static async missileDamageDialog(dialogOptions) {
    
        // Render modal dialog
        let dlgTemplate = dialogOptions.template || "modules/hm-gold/templates/dialog/missile-damage-dialog.html";
        let dialogData = {
            name: dialogOptions.name,
            ranges: dialogOptions.ranges,
            defaultRange: dialogOptions.defaultRange
        };
        const html = await renderTemplate(dlgTemplate, dialogData);
        
        const title = `${dialogOptions.name} Missile Damage`;

        // Create the dialog window
        return Dialog.prompt({
            title: dialogOptions.label,
            content: html.trim(),
            label: "Roll",
            callback: async html => {
                const form = html[0].querySelector("form");
                const formAddlImpact = Number(form.addlImpact.value);
                const formRange = form.range.value || dialogOptions.defaultRange;
                let roll = await game.hm3.DiceHM3.rollTest({
                    type: dialogOptions.type,
                    target: 0,
                    data: dialogOptions.data,
                    diceSides: 6,
                    diceNum: 2,
                    modifier: dialogOptions.ranges[formRange].modifier
                });
                let result = {
                    type: roll.type,
                    range: formRange,
                    damageDice: 2,
                    addlImpact: formAddlImpact,
                    rollObj: roll.rollObj
                }
                return result;
            }
        });
    }

    static async missileAttackDialog(dialogOptions) {
    
        // Render modal dialog
        let dlgTemplate = "modules/hm-gold/templates/dialog/attack-dialog.html";

        let dialogData = {
            aimLocations: ['High', 'Mid', 'Low', 'Arms'],
            defaultAim: 'Mid',
            target: dialogOptions.target
        };

        const missile = dialogOptions.missile;

        const ranges = {
            "4-hex": {
                impact: missile.getFlag('hm-gold','range4-impact') || 0,
                modifier: missile.getFlag('hm-gold','range4-modifier') || 0
            },
            "8-hex": {
                impact: missile.getFlag('hm-gold','range8-impact') || 0,
                modifier: missile.getFlag('hm-gold','range8-modifier') || 0
            },
            "16-hex": {
                impact: missile.getFlag('hm-gold','range16-impact') || 0,
                modifier: missile.getFlag('hm-gold','range16-modifier') || 0
            },
            "32-hex": {
                impact: missile.getFlag('hm-gold','range32-impact') || 0,
                modifier: missile.getFlag('hm-gold','range32-modifier') || 0
            },
            "64-hex": {
                impact: missile.getFlag('hm-gold','range64-impact') || 0,
                modifier: missile.getFlag('hm-gold','range64-modifier') || 0
            },
            "128-hex": {
                impact: missile.getFlag('hm-gold','range128-impact') || 0,
                modifier: missile.getFlag('hm-gold','range128-modifier') || 0
            },
            "256-hex": {
                impact: missile.getFlag('hm-gold','range256-impact') || 0,
                modifier: missile.getFlag('hm-gold','range256-modifier') || 0
            }
        }
        Object.keys(ranges).forEach(range => {
            if (ranges[range].impact < 0) {
                // remove any ranges that are unavailable
                delete ranges[range];
            } else {
                ranges[range].desc = `${range} (${ranges[range].modifier}/${ranges[range].impact})`;
            }
        });

        dialogData.ranges = {};
        Object.entries(ranges).forEach(([key, value]) => {
            dialogData.ranges[value.desc] = key;
        });
        dialogData.rangeExceedsExtreme = false;
        // Get the greatest range value, that's the default range
        const defaultRangeKey = Object.keys(ranges).sort((first, second) => { parseInt(first, 10) - parseInt(second, 10); }).slice(-1)[0];
        dialogData.defaultRange = ranges[defaultRangeKey].desc;

        const html = await renderTemplate(dlgTemplate, dialogData);
        const title = `${dialogOptions.name} Attack`;

        // Create the dialog window
        return Dialog.prompt({
            title: dialogOptions.label,
            content: html.trim(),
            label: "Roll",
            callback: async html => {
                const form = html[0].querySelector("form");
                const formAddlModifier = Number(form.addlModifier.value);
                let formRange = form.range.value;
                for (let range in ranges) {
                    if (formRange === ranges[range].desc) {
                        formRange = range;
                        break;
                    }
                }

                const rangeModifier = ranges[formRange].modifier;

                let roll = await game.hm3.DiceHM3.rollTest({
                    type: dialogOptions.type,
                    target: dialogOptions.target,
                    data: dialogOptions.data,
                    diceSides: 100,
                    diceNum: 1,
                    modifier: formAddlModifier + rangeModifier
                });

                let result = {
                    type: roll.type,
                    origTarget: dialogOptions.target,
                    range: formRange,
                    rangeModifier: rangeModifier,
                    addlModifier: formAddlModifier,
                    modifiedTarget: Number(dialogOptions.target) + rangeModifier + formAddlModifier,
                    isSuccess: roll.isSuccess,
                    isCritical: roll.isCritical,
                    description: roll.description,
                    rollObj: roll.rollObj
                }
                return result;
            }
        });
    }


}
