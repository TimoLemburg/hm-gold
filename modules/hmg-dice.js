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
                const squeezeImpact = it.getFlag('hmg','squeezeImpact');
                const tearImpact = it.getFlag('hmg', 'tearImpact');
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

        const dialogOptions = {
            name: rollData.name,
            ranges: {
                "Short": rollData.impactShort,
                "Medium": rollData.impactMedium,
                "Long": rollData.impactLong,
                "Extreme": rollData.impactExtreme,
                "Extreme64": rollData.impactExtreme64,
                "Extreme128": rollData.impactExtreme128,
                "Extreme256": rollData.impactExtreme256
            },
            defaultRange: rollData.defaultRange ? rollData.defaultRange : "Extreme256",
            data: rollData.data
        };

        // Create the Roll instance
        const roll = await game.hm3.DiceHM3.missileDamageDialog(dialogOptions);

        // If user cancelled the roll, then return immediately
        if (!roll) return null;

        // Prepare for Chat Message
        const chatTemplate = 'systems/hm3/templates/chat/missile-damage-card.html';

        let title = "Missile Damage";
        if (rollData.name != "") {
            title = `${rollData.name} Damage`; 
        }

        let rangeImpact = 0;
        if (roll.range === 'Short') {
            rangeImpact = rollData.impactShort;
        } else if (roll.range === 'Medium') {
            rangeImpact = rollData.impactMedium;
        } else if (roll.range === 'Long') {
            rangeImpact = rollData.impactLong;
        } else if (roll.range === 'Extreme') {
            rangeImpact = rollData.impactExtreme;
        } else if (roll.range === 'Extreme64') {
            rangeImpact = rollData.impactExtreme64;
        } else if (roll.range === 'Extreme128') {
            rangeImpact = rollData.impactExtreme128;
        } else if (roll.range === 'Extreme256') {
            rangeImpact = rollData.impactExtreme256
        }

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

}
