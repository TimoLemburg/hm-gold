/**
 * HMG Item Class
 * This class implements all of the mechanisms to override the HarnMasterItem class as well as the
 * HTML fixups for the Item sheet (HarnMasterItemSheet) and all of the various HTML templates.
 *
 * The following flags are defined to hold item data (the scope is always "hm-gold"):
 *
 *    Item Type       Flag
 *    weapongear      squeeze-impact
 *    weapongear      tear-impact
 *    missilegear     range4-modifier
 *    missilegear     range8-modifier
 *    missilegear     range16-modifier
 *    missilegear     range32-modifier
 *    missilegear     range64-modifier
 *    missilegear     range128-modifier
 *    missilegear     range256-modifier
 *    missilegear     range4-impact
 *    missilegear     range8-impact
 *    missilegear     range16-impact
 *    missilegear     range32-impact
 *    missilegear     range64-impact
 *    missilegear     range128-impact
 *    missilegear     range256-impact
 *    armorgear       squeeze
 *    armorgear       tear
 *    armorlocation   probweight-arms
 *    armorlocation   squeeze
 *    armorlocation   tear
 *
 * NOTE: For missilegear, the "modifier" is the value that modifies EML
 *       for the appropriate range; range above is expressed in hexes
 *       (compatible with HMG tables) even though the system will track
 *       based on feet instead.
 */
export class HMGItem {
    static prepareData(item) {
        const itemData = item.data;
        const data = itemData.data;

        if (itemData.type === 'armorlocation') {
            data.probWeight.arms = item.getFlag('hm-gold', 'aim-arms') || 0;
            data.squeeze = item.getFlag('hm-gold', 'squeeze') || 0;
            data.tear = item.getFlag('hm-gold', 'tear') || 0;
        }
    }

    static calcInjurySeverity(injury) {
        injury.data.data.severity = `${injury.data.data.injuryLevel}`;
    }

    static calcPenaltyPct(value) {
        return (value || 0);
    }

    static armorgearRenderFix(itemSheet, html, data) {
        const item = itemSheet.item;
        const origData = data;
        data = origData.data;

        const squeeze = item.getFlag('hm-gold', 'squeeze') || 0;
        const tear = item.getFlag('hm-gold', 'tear') || 0;
        html.find('#armorgear-fire').after(`
             <div class="armorgear-protection-item" id="armorgear-squeeze">
                 <label class="label">Squeeze</label>
                 <input class="value" type="number" name="flags.hm-gold.squeeze"
                     value="${squeeze}" data-dtype="Number" />
             </div>
             <div class="armorgear-protection-item" id="armorgear-tear">
                 <label class="label">Tear</label>
                 <input class="value" type="number" name="flags.hm-gold.tear"
                     value="${tear}" data-dtype="Number" />
             </div>
             <div></div>
             <div></div>`);
    }

    static weapongearRenderFix(itemSheet, html, data) {
        const item = itemSheet.item;
        const origData = data;
        data = origData.data;

        const squeeze = item.getFlag('hm-gold', 'squeeze-impact') || 0;
        const tear = item.getFlag('hm-gold', 'tear-impact') || 0;
        html.find('#weapongear-piercing').after(`
                <div class="resource" id="weapongear-squeeze">
                    <label class="resource-label">Squeeze</label>
                    <input type="number" name="flags.hm-gold.squeeze-impact" value="${squeeze}" data-dtype="Number" />
                </div>
                <div class="resource" id="weapongear-tear">
                    <label class="resource-label">Tear</label>
                    <input type="number" name="flags.hm-gold.tear-impact" value="${tear}" data-dtype="Number" />
                </div>
                <div></div>`);
    }

    static armorlocationRenderFix(itemSheet, html, data) {
        const item = itemSheet.item;
        const origData = data;
        data = origData.data;

        const squeeze = item.getFlag('hm-gold', 'squeeze') || 0;
        const tear = item.getFlag('hm-gold', 'tear') || 0;
        const probWeightArms = item.getFlag('hm-gold', 'probweight-arms') || 0;
        html.find('#armorlocation-fire').after(`
                    <div class="protection" id="armorlocation-squeeze">
                        <label class="label">Squeeze</label>
                        <input class="value" type="number" name="flags.hm-gold.squeeze" value="${squeeze}"
                            data-dtype="Number" />
                    </div>
                    <div class="protection" id="armorlocation-tear">
                        <label class="label">Tear</label>
                        <input class="value" type="number" name="flags.hm-gold.tear" value="${tear}" data-dtype="Number" />
                    </div>
                    <div></div>
                    <div></div>`);
        html.find('#armorlocation-probweight div.weight').setAttribute('class', 'weight grid grid-fixed-row grid-4col');
        const probWeightArms = item.getFlag('hm-gold', 'probweight-arms') || 0;
        html.find('#armorlocation-probweight-low').after(`
                    <div class="prob-weight" id="armorlocation-probweight-arms">
                        <label class="label">Arms Aim</label>
                        <input class="value" type="number" name="flags.hm-gold.probweight-arms" value="${probWeightArms}"
                            data-dtype="Number" />
                    </div>`);
    }

    static injuryRenderFix(itemSheet, html, data) {
        const item = itemSheet.item;
        const origData = data;
        data = origData.data;

        html.find('#injury-level label').text('Injury Points');
    }

    static missilegearRenderFix(itemSheet, html, data) {
        const item = itemSheet.item;
        const origData = data;
        data = origData.data;

        // Replace the headers
        html.find('#missilegear-range-header').empty().append(`
                    <div class="range-label"></div>
                    <div class="range-value">4</div>
                    <div class="range-value">8</div>
                    <div class="range-value">16</div>
                    <div class="range-value">32</div>
                    <div class="range-value">64</div>
                    <div class="range-value">128</div>
                    <div class="range-value">256</div>`);

        const range4Modifier = item.getFlag('hm-gold', 'range4-modifier') || 0;
        const range8Modifier = item.getFlag('hm-gold', 'range8-modifier') || 0;
        const range16Modifier = item.getFlag('hm-gold', 'range16-modifier') || 0;
        const range32Modifier = item.getFlag('hm-gold', 'range32-modifier') || 0;
        const range64Modifier = item.getFlag('hm-gold', 'range64-modifier') || 0;
        const range128Modifier = item.getFlag('hm-gold', 'range128-modifier') || 0;
        const range256Modifier = item.getFlag('hm-gold', 'range256-modifier') || 0;
        const range4Impact = item.getFlag('hm-gold', 'range4-impact') || 0;
        const range8Impact = item.getFlag('hm-gold', 'range8-impact') || 0;
        const range16Impact = item.getFlag('hm-gold', 'range16-impact') || 0;
        const range32Impact = item.getFlag('hm-gold', 'range32-impact') || 0;
        const range64Impact = item.getFlag('hm-gold', 'range64-impact') || 0;
        const range128Impact = item.getFlag('hm-gold', 'range128-impact') || 0;
        const range256Impact = item.getFlag('hm-gold', 'range256-impact') || 0;
        html.find('#missilegear-range-values').empty().append(`
                    <div class="range-label">Modifier</div>
                    <div class="range-value" id="missilegear-range4-modifier">
                        <input type="text" name="flags.hm-gold.range4-modifier" 
                        value="${range4Modifier}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range8-modifier">
                        <input type="text" name="flags.hm-gold.range8-modifier" 
                        value="${range8Modifier}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range16-modifier">
                        <input type="text" name="flags.hm-gold.range16-modifier" 
                        value="${range16Modifier}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range32-modifier">
                        <input type="text" name="flags.hm-gold.range32-modifier" 
                        value="${range32Modifier}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range64-modifier">
                        <input type="text" name="flags.hm-gold.range64-modifier" 
                        value="${range64Modifier}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range128-modifier">
                        <input type="text" name="flags.hm-gold.range128-modifier" 
                        value="${range128Modifier}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range256-modifier">
                        <input type="text" name="flags.hm-gold.range256-modifier" 
                        value="${range256Modifier}" data-dtype="Number" /></div>`);
        html.find('#missilegear-impact-values').empty().append(`
                    <div class="range-label">Impact</div>
                    <div class="range-value" id="missilegear-range4-impact">
                        <input type="text" name="flags.hm-gold.range4-impact" 
                        value="${range4Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range8-impact">
                        <input type="text" name="flags.hm-gold.range8-impact" 
                        value="${range8Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range16-impact">
                        <input type="text" name="flags.hm-gold.range16-impact" 
                        value="${range16Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range32-impact">
                        <input type="text" name="flags.hm-gold.range32-impact" 
                        value="${range32Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range64-impact">
                        <input type="text" name="flags.hm-gold.range64-impact" 
                        value="${range64Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range128-impact">
                        <input type="text" name="flags.hm-gold.range128-impact" 
                        value="${range128Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range256-impact">
                        <input type="text" name="flags.hm-gold.range256-impact" 
                        value="${range256Impact}" data-dtype="Number" /></div>`);
    }
}
