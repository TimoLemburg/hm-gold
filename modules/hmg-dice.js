class HMGDice {
    /**
     * Returns a structure specifying the default aspect for a weapon, as well as the
     * impact values for all other aspects.  The default aspect is always the aspect
     * with the greatest impact.
     * 
     * @param {*} weapon Name of weapon
     * @param {*} items List of items containing 'weapongear' items.
     */
    static _calcWeaponAspect(weapon, items) {
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
                const squeezeImpact = it.getFlag('hmg','squeeze-impact');
                const tearImpact = it.getFlag('hmg', 'tear-impact');
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

    static async missileDamageRoll(rollData) {
        const speaker = rollData.speaker || ChatMessage.getSpeaker();

        const ranges = ();
        const ranges["4-hex"].impact = missile.getFlag('hmg','range4-impact');
        const ranges["8-hex"].impact = missile.getFlag('hmg','range8-impact');
        const ranges["16-hex"].impact = missile.getFlag('hmg','range16-impact');
        const ranges["32-hex"].impact = missile.getFlag('hmg','range32-impact');
        const ranges["64-hex"].impact = missile.getFlag('hmg','range64-impact');
        const ranges["128-hex"].impact = missile.getFlag('hmg','range128-impact');
        const ranges["256-hex"].impact = missile.getFlag('hmg','range256-impact');
        const ranges["4-hex"].modifier = missile.getFlag('hmg','range4-modifier');
        const ranges["8-hex"].modifier = missile.getFlag('hmg','range8-modifier');
        const ranges["16-hex"].modifier = missile.getFlag('hmg','range16-modifier');
        const ranges["32-hex"].modifier = missile.getFlag('hmg','range32-modifier');
        const ranges["64-hex"].modifier = missile.getFlag('hmg','range64-modifier');
        const ranges["128-hex"].modifier = missile.getFlag('hmg','range128-modifier');
        const ranges["256-hex"].modifier = missile.getFlag('hmg','range256-modifier');

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
                let roll = await DiceHM3.rollTest({
                    type: dialogOptions.type,
                    target: 0,
                    data: dialogOptions.data,
                    diceSides: 6,
                    diceNum: 2,
                    modifier: ranges[formRange].modifier
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


}
