import { Panel, TimeRangeStore } from 'common';
import { InfluxQuery } from '../metrics.m';
import * as i0 from "@angular/core";
export declare class InfluxMetricsDesignerComponent {
    panel: Panel;
    private time;
    get metrics(): any;
    constructor(panel: Panel, time: TimeRangeStore);
    onRemove(t: InfluxQuery): void;
    onMoveUp(t: InfluxQuery): void;
    onMoveDown(t: InfluxQuery): void;
    onDuplicate(t: InfluxQuery): void;
    rebuild(): void;
    static ɵfac: i0.ɵɵFactoryDef<InfluxMetricsDesignerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<InfluxMetricsDesignerComponent, "metrics-designer", never, {}, {}, never, never>;
}
//# sourceMappingURL=designer.d.ts.map