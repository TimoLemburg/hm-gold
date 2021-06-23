export class HMGItem {
    static prepareData(item) {
        const itemData = item.data;
        const data = itemData.data;

        if (itemData.type === 'armorlocation') {
            data.probWeight.arms = data.probWeight?.arms || 0;
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

        const squeeze = item.getFlag('hm-gold', 'squeeze') || 0;
        const tear = item.getFlag('hm-gold', 'tear') || 0;
        html.find('#weapongear-piercing').after(`
                <div class="resource" id="weapongear-squeeze">
                    <label class="resource-label">Squeeze</label>
                    <input type="number" name="flags.hm-gold.squeeze" value="${squeeze}" data-dtype="Number" />
                </div>
                <div class="resource" id="weapongear-tear">
                    <label class="resource-label">Tear</label>
                    <input type="number" name="flags.hm-gold.tear" value="${tear}" data-dtype="Number" />
                </div>
                <div></div>`);
    }

    static armorlocationRenderFix(itemSheet, html, data) {
        const item = itemSheet.item;
        const origData = data;
        data = origData.data;

        const squeeze = item.getFlag('hm-gold', 'squeeze') || 0;
        const tear = item.getFlag('hm-gold', 'tear') || 0;
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

        const extreme64Impact = item.getFlag('hm-gold', 'extreme64-impact') || 0;
        const extreme64Range = item.getFlag('hm-gold', 'extreme64-range') || 0;
        const extreme128Impact = item.getFlag('hm-gold', 'extreme128-impact') || 0;
        const extreme128Range = item.getFlag('hm-gold', 'extreme128-range') || 0;
        const extreme256Impact = item.getFlag('hm-gold', 'extreme256-impact') || 0;
        const extreme256Range = item.getFlag('hm-gold', 'extreme256-range') || 0;
        html.find('#missilegear-range-extreme').after(`
                    <div class="range-value" id="missilegear-range-extreme64">
                        <input type="text" name="flags.hm-gold.extreme64-range" 
                        value="${extreme64Range}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range-extreme128">
                        <input type="text" name="flags.hm-gold.extreme128-range" 
                        value="${extreme128Range}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-range-extreme256">
                        <input type="text" name="flags.hm-gold.extreme256-range" 
                        value="${extreme256Range}" data-dtype="Number" /></div> `);
        html.find('#missilegear-impact-extreme').after(`
                    <div class="range-value" id="missilegear-impact-extreme64">
                        <input type="text" name="flags.hm-gold.extreme64-impact" 
                        value="${extreme64Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-impact-extreme128">
                        <input type="text" name="flags.hm-gold.extreme128-impact" 
                        value="${extreme128Impact}" data-dtype="Number" /></div>
                    <div class="range-value" id="missilegear-impact-extreme256">
                        <input type="text" name="flags.hm-gold.extreme256-impact" 
                        value="${extreme256Impact}" data-dtype="Number" /></div>`);
    }
}
