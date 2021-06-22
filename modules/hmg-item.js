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
}
