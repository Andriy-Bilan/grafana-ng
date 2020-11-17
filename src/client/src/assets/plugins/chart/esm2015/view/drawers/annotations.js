import { Injectable } from '@angular/core';
import { AlertState, Moment } from 'common';
import { ColorHelper } from 'uilib';
import { ChartJsExtension, BaseDrawer } from '../../base/chart-base-extension';
import * as i0 from "@angular/core";
import * as i1 from "../../base/chart.store";
export class AnnotationDrawerPlugin extends ChartJsExtension {
    constructor(store) {
        super(store);
    }
    afterDatasetsDraw(chart, _) {
        var _a;
        if (!((_a = chart.data.datasets) === null || _a === void 0 ? void 0 : _a.length)) {
            return;
        }
        this
            .panel
            .annotations
            .forEach(a => new AnnotationDrawer(chart, this.widget, a).draw());
    }
}
AnnotationDrawerPlugin.ɵfac = function AnnotationDrawerPlugin_Factory(t) { return new (t || AnnotationDrawerPlugin)(i0.ɵɵinject(i1.ChartStore)); };
AnnotationDrawerPlugin.ɵprov = i0.ɵɵdefineInjectable({ token: AnnotationDrawerPlugin, factory: AnnotationDrawerPlugin.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AnnotationDrawerPlugin, [{
        type: Injectable
    }], function () { return [{ type: i1.ChartStore }]; }, null); })();
class AnnotationDrawer extends BaseDrawer {
    constructor(chart, widget, annotation) {
        super(chart);
        this.widget = widget;
        this.annotation = annotation;
    }
    draw() {
        if (this.annotation.alert && !this.widget.alert) {
            return;
        }
        if (!this.annotation.timeEnd) {
            this.renderLineAnnotation();
        }
        else {
            this.renderRegionAnnotation();
        }
    }
    get color() {
        if (this.annotation.alert) {
            const alert = this.annotation.alert;
            const state = AlertState[alert.currentState];
            switch (state) {
                case AlertState.Alerting:
                    return ColorHelper.ALERTING_COLOR;
                case AlertState.Ok:
                    return ColorHelper.OK_COLOR;
                case AlertState.Pending:
                case AlertState.NoData:
                    return ColorHelper.PENDING_COLOR;
            }
        }
        // return chart
        // 	.dashboard
        // 	?.annotationRules[ annot.ruleIndex ]
        // 	?.color ?? "#00D3FF";
        return ColorHelper.DEFAULT_ANNOTATION_COLOR;
    }
    renderLineAnnotation() {
        var time = Moment.toDate(this.annotation.time);
        let offset = this.scaleX.getPixelForValue(time);
        if (!(offset < this.scaleX.left || offset > this.scaleX.right)) {
            this.renderLine(offset, this.color /*?? AnnotationsDrawerPlugin.COLOR*/);
        }
    }
    renderLine(offset, color) {
        const lw = 0.8;
        const context = this.context;
        const x = this.alignPixel(offset, lw);
        const y1 = this.alignPixel(this.minY, lw);
        const y2 = this.alignPixel(this.maxY, lw);
        context.beginPath();
        context.strokeStyle = context.fillStyle = color;
        context.lineWidth = lw;
        context.setLineDash([3, 2]);
        context.moveTo(x, y1);
        context.lineTo(x, y2);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y2);
        context.lineTo(x + 5, y2 + 5);
        context.lineTo(x - 5, y2 + 5);
        context.lineTo(x, y2);
        context.closePath();
        context.setLineDash([]);
        context.fill();
        this.annotation.rect = {
            x1: offset - 5,
            y1: this.maxY,
            x2: offset + 5,
            y2: this.maxY + 5
        };
    }
    renderRegionAnnotation() {
        var timeStart = Moment.toDate(this.annotation.time);
        var timeEnd = Moment.toDate(this.annotation.timeEnd);
        let os = this.scaleX.getPixelForValue(timeStart);
        let oe = this.scaleX.getPixelForValue(timeEnd);
        if (oe < this.scaleX.left || os > this.scaleX.right) {
            return;
        }
        os = Math.max(os, this.scaleX.left);
        oe = Math.max(this.scaleX.left, Math.min(oe, this.scaleX.right));
        this.renderRegion(os, oe, this.color /*?? AnnotationsDrawerPlugin.COLOR*/);
    }
    renderRegion(os, oe, color) {
        const lw = 0.8;
        const x1 = this.alignPixel(os, lw);
        const x2 = this.alignPixel(oe, lw);
        const y1 = this.alignPixel(this.minY, lw);
        const y2 = this.alignPixel(this.maxY, lw);
        const context = this.context;
        context.strokeStyle = color;
        context.fillStyle = "#00d3ff" + '20';
        context.lineWidth = lw;
        context.setLineDash([3, 2]);
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1, y2);
        context.stroke();
        context.moveTo(x2, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.fillRect(x1, y1, x2 - x1, y2 - y1);
        context.fillStyle = color;
        context.fillRect(x1, y2, x2 - x1, 5);
        context.setLineDash([]);
        context.closePath();
        this.annotation.rect = {
            x1: Math.min(os, oe),
            y1: this.maxY,
            x2: Math.max(oe, os),
            y2: this.maxY + 5
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9hcHAvcGx1Z2lucy93aWRnZXRzL2NoYXJ0L3NyYy92aWV3L2RyYXdlcnMvYW5ub3RhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFjLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQzs7O0FBSy9FLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFFM0QsWUFBYSxLQUFpQjtRQUM3QixLQUFLLENBQUUsS0FBSyxDQUFFLENBQUM7SUFFaEIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDOztRQUN6QixJQUFJLFFBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLDBDQUFFLE1BQU0sQ0FBQSxFQUFFO1lBQ2pDLE9BQU87U0FDUDtRQUVELElBQUk7YUFDRixLQUFLO2FBQ0wsV0FBVzthQUNYLE9BQU8sQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksZ0JBQWdCLENBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxFQUFFLENBQUUsQ0FBQztJQUN4RSxDQUFDOzs0RkFoQlcsc0JBQXNCOzhEQUF0QixzQkFBc0IsV0FBdEIsc0JBQXNCO2tEQUF0QixzQkFBc0I7Y0FEbEMsVUFBVTs7QUFvQlgsTUFBTSxnQkFBaUIsU0FBUSxVQUFVO0lBRXhDLFlBQ0MsS0FBVSxFQUNGLE1BQWEsRUFDYixVQUFzQjtRQUM3QixLQUFLLENBQUUsS0FBSyxDQUFFLENBQUE7UUFGUCxXQUFNLEdBQU4sTUFB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O1xyXG5pbXBvcnQgeyBBbGVydFN0YXRlLCBBbm5vdGF0aW9uLCBNb21lbnQgfSBmcm9tICdjb21tb24nO1xyXG5pbXBvcnQgeyBDb2xvckhlbHBlciB9IGZyb20gJ3VpbGliJztcclxuaW1wb3J0IHsgQ2hhcnRKc0V4dGVuc2lvbiwgQmFzZURyYXdlciB9IGZyb20gJy4uLy4uL2Jhc2UvY2hhcnQtYmFzZS1leHRlbnNpb24nO1xyXG5pbXBvcnQgeyBDaGFydFN0b3JlIH0gZnJvbSAnLi4vLi4vYmFzZS9jaGFydC5zdG9yZSc7XHJcbmltcG9ydCB7IENoYXJ0IH0gZnJvbSAnLi4vLi4vY2hhcnQubSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBbm5vdGF0aW9uRHJhd2VyUGx1Z2luIGV4dGVuZHMgQ2hhcnRKc0V4dGVuc2lvbiB7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoIHN0b3JlOiBDaGFydFN0b3JlICl7XHJcblx0XHRzdXBlciggc3RvcmUgKTtcclxuXHJcblx0fVxyXG5cclxuXHRhZnRlckRhdGFzZXRzRHJhdyhjaGFydCwgXykge1xyXG5cdFx0aWYoICFjaGFydC5kYXRhLmRhdGFzZXRzPy5sZW5ndGggKXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXNcclxuXHRcdFx0LnBhbmVsXHJcblx0XHRcdC5hbm5vdGF0aW9uc1xyXG5cdFx0XHQuZm9yRWFjaCggYSA9PiBuZXcgQW5ub3RhdGlvbkRyYXdlciggY2hhcnQsIHRoaXMud2lkZ2V0LCBhICkuZHJhdygpICk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBBbm5vdGF0aW9uRHJhd2VyIGV4dGVuZHMgQmFzZURyYXdlciB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBcclxuXHRcdGNoYXJ0OiBhbnksXHJcblx0XHRwcml2YXRlIHdpZGdldDogQ2hhcnQsXHJcblx0XHRwcml2YXRlIGFubm90YXRpb246IEFubm90YXRpb24gKXtcclxuXHRcdFx0c3VwZXIoIGNoYXJ0IClcclxuXHR9XHJcblxyXG5cdGRyYXcoKXtcclxuXHRcdGlmKCB0aGlzLmFubm90YXRpb24uYWxlcnQgJiYgIXRoaXMud2lkZ2V0LmFsZXJ0ICl7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggIXRoaXMuYW5ub3RhdGlvbi50aW1lRW5kICl7XHJcblx0XHRcdHRoaXMucmVuZGVyTGluZUFubm90YXRpb24oKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucmVuZGVyUmVnaW9uQW5ub3RhdGlvbigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXQgY29sb3IoKXtcclxuXHRcdGlmKCB0aGlzLmFubm90YXRpb24uYWxlcnQgKXtcclxuXHRcdFx0Y29uc3QgYWxlcnQgPSB0aGlzLmFubm90YXRpb24uYWxlcnQ7XHJcblx0XHRcdGNvbnN0IHN0YXRlID0gQWxlcnRTdGF0ZVthbGVydC5jdXJyZW50U3RhdGVdO1xyXG5cclxuXHRcdFx0c3dpdGNoKCBzdGF0ZSApe1xyXG5cdFx0XHRcdGNhc2UgQWxlcnRTdGF0ZS5BbGVydGluZzpcclxuXHRcdFx0XHRcdHJldHVybiBDb2xvckhlbHBlci5BTEVSVElOR19DT0xPUjsgXHJcblxyXG5cdFx0XHRcdGNhc2UgQWxlcnRTdGF0ZS5PazpcclxuXHRcdFx0XHRcdHJldHVybiBDb2xvckhlbHBlci5PS19DT0xPUjsgXHJcblxyXG5cdFx0XHRcdGNhc2UgQWxlcnRTdGF0ZS5QZW5kaW5nOlxyXG5cdFx0XHRcdGNhc2UgQWxlcnRTdGF0ZS5Ob0RhdGE6XHJcblx0XHRcdFx0XHRyZXR1cm4gQ29sb3JIZWxwZXIuUEVORElOR19DT0xPUjsgXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyByZXR1cm4gY2hhcnRcclxuXHRcdC8vIFx0LmRhc2hib2FyZFxyXG5cdFx0Ly8gXHQ/LmFubm90YXRpb25SdWxlc1sgYW5ub3QucnVsZUluZGV4IF1cclxuXHRcdC8vIFx0Py5jb2xvciA/PyBcIiMwMEQzRkZcIjtcclxuXHJcblx0XHRyZXR1cm4gQ29sb3JIZWxwZXIuREVGQVVMVF9BTk5PVEFUSU9OX0NPTE9SO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyTGluZUFubm90YXRpb24oICl7XHJcblx0XHR2YXIgdGltZSA9IE1vbWVudC50b0RhdGUodGhpcy5hbm5vdGF0aW9uLnRpbWUpO1xyXG5cdFx0bGV0IG9mZnNldCA9IHRoaXMuc2NhbGVYLmdldFBpeGVsRm9yVmFsdWUoIHRpbWUgKTtcclxuXHJcblx0XHRpZighICggb2Zmc2V0IDwgdGhpcy5zY2FsZVgubGVmdCB8fCBvZmZzZXQgPiB0aGlzLnNjYWxlWC5yaWdodCApICl7XHJcblx0XHRcdHRoaXMucmVuZGVyTGluZSggb2Zmc2V0LCB0aGlzLmNvbG9yIC8qPz8gQW5ub3RhdGlvbnNEcmF3ZXJQbHVnaW4uQ09MT1IqLyApXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZW5kZXJMaW5lKCBvZmZzZXQ6IG51bWJlciwgY29sb3IgKXtcclxuXHRcdGNvbnN0IGx3ID0gMC44O1xyXG5cdFx0Y29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dDtcclxuXHJcblx0XHRjb25zdCB4ID0gdGhpcy5hbGlnblBpeGVsKCBvZmZzZXQsIGx3ICk7XHJcblx0XHRjb25zdCB5MSA9IHRoaXMuYWxpZ25QaXhlbCggdGhpcy5taW5ZLCBsdyApO1xyXG5cdFx0Y29uc3QgeTIgPSB0aGlzLmFsaWduUGl4ZWwoIHRoaXMubWF4WSwgbHcgKTtcclxuXHJcblx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IGx3O1xyXG5cdFx0Y29udGV4dC5zZXRMaW5lRGFzaChbMywgMl0pO1xyXG5cdFx0Y29udGV4dC5tb3ZlVG8oIHgsIHkxICk7XHJcblx0XHRjb250ZXh0LmxpbmVUbyggeCwgeTIgKTtcclxuXHRcdGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG5cdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcblx0XHRjb250ZXh0Lm1vdmVUbyggeCwgeTIgKTtcclxuXHRcdGNvbnRleHQubGluZVRvKCB4ICsgNSwgeTIgKyA1ICk7XHJcblx0XHRjb250ZXh0LmxpbmVUbyggeCAtIDUsIHkyICsgNSApO1xyXG5cdFx0Y29udGV4dC5saW5lVG8oIHgsIHkyICk7XHJcblx0XHRcclxuXHRcdGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblx0XHRjb250ZXh0LnNldExpbmVEYXNoKFtdKTtcclxuXHRcdGNvbnRleHQuZmlsbCgpO1xyXG5cclxuXHRcdHRoaXMuYW5ub3RhdGlvbi5yZWN0ID0ge1xyXG5cdFx0XHR4MTogb2Zmc2V0IC0gNSxcclxuXHRcdFx0eTE6IHRoaXMubWF4WSxcclxuXHRcdFx0eDI6IG9mZnNldCArIDUsXHJcblx0XHRcdHkyOiB0aGlzLm1heFkgKyA1XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZW5kZXJSZWdpb25Bbm5vdGF0aW9uKCl7XHJcblx0XHR2YXIgdGltZVN0YXJ0ID0gTW9tZW50LnRvRGF0ZSggdGhpcy5hbm5vdGF0aW9uLnRpbWUgKTtcclxuXHRcdHZhciB0aW1lRW5kID0gTW9tZW50LnRvRGF0ZSggdGhpcy5hbm5vdGF0aW9uLnRpbWVFbmQgKTtcclxuXHJcblx0XHRsZXQgb3MgPSB0aGlzLnNjYWxlWC5nZXRQaXhlbEZvclZhbHVlKCB0aW1lU3RhcnQgKTtcclxuXHRcdGxldCBvZSA9IHRoaXMuc2NhbGVYLmdldFBpeGVsRm9yVmFsdWUoIHRpbWVFbmQgKTtcclxuXHJcblx0XHRpZiggb2UgPCB0aGlzLnNjYWxlWC5sZWZ0IHx8IG9zID4gdGhpcy5zY2FsZVgucmlnaHQgKXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdG9zID0gTWF0aC5tYXgoIG9zLCB0aGlzLnNjYWxlWC5sZWZ0ICk7XHJcblx0XHRvZSA9IE1hdGgubWF4KCB0aGlzLnNjYWxlWC5sZWZ0LFx0TWF0aC5taW4oIG9lLCB0aGlzLnNjYWxlWC5yaWdodCApKTtcclxuXHJcblx0XHR0aGlzLnJlbmRlclJlZ2lvbiggb3MsIG9lLCB0aGlzLmNvbG9yIC8qPz8gQW5ub3RhdGlvbnNEcmF3ZXJQbHVnaW4uQ09MT1IqLyApXHJcblx0fVxyXG5cclxuXHRyZW5kZXJSZWdpb24oIG9zOiBudW1iZXIsIG9lOiBudW1iZXIsIGNvbG9yICl7XHJcblx0XHRjb25zdCBsdyA9IDAuODtcclxuXHRcdGNvbnN0IHgxID0gdGhpcy5hbGlnblBpeGVsKCBvcywgbHcgKTtcclxuXHRcdGNvbnN0IHgyID0gdGhpcy5hbGlnblBpeGVsKCBvZSwgbHcgKTtcclxuXHRcdGNvbnN0IHkxID0gdGhpcy5hbGlnblBpeGVsKCB0aGlzLm1pblksIGx3ICk7XHJcblx0XHRjb25zdCB5MiA9IHRoaXMuYWxpZ25QaXhlbCggdGhpcy5tYXhZLCBsdyApO1xyXG5cclxuXHRcdGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XHJcblxyXG5cdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSBcIiMwMGQzZmZcIiArICcyMCdcclxuXHRcdGNvbnRleHQubGluZVdpZHRoID0gbHc7XHJcblx0XHRjb250ZXh0LnNldExpbmVEYXNoKFszLCAyXSk7XHJcblxyXG5cdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcblx0XHRjb250ZXh0Lm1vdmVUbyggeDEsIHkxICk7XHJcblx0XHRjb250ZXh0LmxpbmVUbyggeDEsIHkyICk7XHJcblx0XHRjb250ZXh0LnN0cm9rZSgpO1xyXG5cdFx0XHJcblx0XHRjb250ZXh0Lm1vdmVUbyggeDIsIHkxICk7XHJcblx0XHRjb250ZXh0LmxpbmVUbyggeDIsIHkyICk7XHJcblx0XHRjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuXHRcdGNvbnRleHQuZmlsbFJlY3QoIHgxLCB5MSxcdHgyIC0geDEsIHkyIC0geTEgKTtcdFxyXG5cclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3IgO1xyXG5cdFx0Y29udGV4dC5maWxsUmVjdCggeDEsIHkyLFx0eDIgLSB4MSwgNSApO1x0XHJcblx0XHRjb250ZXh0LnNldExpbmVEYXNoKFtdKTtcclxuXHRcdGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG5cdFx0dGhpcy5hbm5vdGF0aW9uLnJlY3QgPSB7XHJcblx0XHRcdHgxOiBNYXRoLm1pbiggb3MsIG9lICksXHJcblx0XHRcdHkxOiB0aGlzLm1heFksXHJcblx0XHRcdHgyOiBNYXRoLm1heCggb2UsIG9zICksXHJcblx0XHRcdHkyOiB0aGlzLm1heFkgKyA1XHJcblx0XHR9XHJcblx0fVxyXG59Il19