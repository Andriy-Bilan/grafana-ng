import { Moment } from 'common';
import { AXIS_Y_LEFT, TooltipSortOrder } from '../../chart.m';
import { ColorHelper } from 'uilib';
import { AxisUnitHelper } from '../helpers/unit-helper';
export class TooltipBuilder {
    constructor(model, component) {
        this.model = model;
        this.component = component;
        this.ID = "chartjs-tooltip";
        this.TOOLTIP_SELECTOR = "ed-tooltip";
    }
    static build(comp) {
        Chart.Tooltip.positioners.custom = (_, event) => {
            return {
                x: event.x,
                y: event.y
            };
        };
        return {
            mode: 'index',
            position: "custom",
            axis: 'x',
            intersect: false,
            caretSize: 0,
            xPadding: 10,
            bodySpacing: 5,
            titleAlign: 'right',
            enabled: false,
            custom: (model) => new TooltipBuilder(model, comp).create()
        };
    }
    get root() {
        var tooltipEl = document.getElementById(this.ID);
        // Create element on first render
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = this.ID;
            tooltipEl.innerHTML = `<div class='graph-tooltip grafana-tooltip ${this.TOOLTIP_SELECTOR}'></div>`;
            document.body.appendChild(tooltipEl);
        }
        return tooltipEl;
    }
    create() {
        var tooltipElement = this.root;
        // Hide if no tooltip
        if (this.model.opacity === 0 /*|| chart.showAnnotView*/) {
            tooltipElement.style.opacity = '0';
            return;
        }
        tooltipElement.classList.remove('above', 'below', 'no-transform');
        if (this.model.yAlign) {
            tooltipElement.classList.add(this.model.yAlign);
        }
        else {
            tooltipElement.classList.add('no-transform');
        }
        if (this.model.body) {
            this.createBody();
        }
        this.setPosition();
    }
    setPosition() {
        var tooltipElement = this.root;
        const chart = this.component.control.chart;
        var position = chart
            .canvas
            .getBoundingClientRect();
        const elWidth = document
            .getElementsByClassName(this.TOOLTIP_SELECTOR)[0]
            .getBoundingClientRect()
            .width;
        const negMargin = (this.model.caretX + elWidth > position.width) ?
            elWidth + 2 * this.model.xPadding : 0;
        tooltipElement.style.opacity = '1';
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = position.left + window.pageXOffset + this.model.caretX - negMargin + 'px';
        tooltipElement.style.top = position.top + window.pageYOffset + this.model.caretY + 'px';
        tooltipElement.style.fontFamily = this.model._bodyFontFamily;
        tooltipElement.style.padding = this.model.yPadding + 'px ' + this.model.xPadding + 'px';
        tooltipElement.style.pointerEvents = 'none';
    }
    createBody() {
        var tooltipElement = this.root;
        var chart = this.component;
        var w = this.component.store.panel.widget;
        var titleLines = this.model.title || [];
        var innerHtml = '';
        titleLines.forEach(function (title) {
            const date = Date.parse(title);
            const time = Moment.format(date);
            innerHtml += `<div class="graph-tooltip-time">${time}</div>`;
        });
        const parsedBodyLines = this.sort();
        parsedBodyLines.forEach((body, i) => {
            const { seriesName, value, color } = body;
            let seriesNameEl = `
				<div class="graph-tooltip-series-name">
					<i class="fa fa-minus" style="color:${color};"></i> ${seriesName}:
				</div>`;
            const ds = chart
                .data
                .datasets
                .find(x => x.label == seriesName);
            const axis = (ds.yAxisID == AXIS_Y_LEFT) ? w.axes.leftY : w.axes.rightY;
            const decimals = w.legend.decimals ? w.legend.decimals : 1;
            const resValue = AxisUnitHelper.getFormattedValue(value, axis.unit, decimals);
            let valueEl = `<div class="graph-tooltip-value ">${resValue}</div>`;
            let item = `
				<div class="graph-tooltip-list-item">
					${seriesNameEl}
					${valueEl}
				</div>`;
            innerHtml += item;
        });
        var tableRoot = tooltipElement.querySelector(`.${this.TOOLTIP_SELECTOR}`);
        tableRoot.innerHTML = innerHtml;
    }
    sort() {
        function getBody(bodyItem) {
            return bodyItem.lines;
        }
        var bodyLines = this.model.body.map(getBody);
        const sortOrder = this
            .component
            .widget
            .display
            .tooltipSortOrder;
        const parsedBodyLines = [];
        bodyLines.forEach((body, i) => {
            var colors = this.model.labelColors[i];
            var color = ColorHelper.hexToRgbString(colors.backgroundColor);
            let index = body[0].lastIndexOf(':');
            const seriesName = body[0].substring(0, index);
            const value = parseFloat(this.model.dataPoints[i].value);
            parsedBodyLines.push({ seriesName, value, color });
        });
        switch (sortOrder) {
            case TooltipSortOrder.Increasing:
                parsedBodyLines.sort((a, b) => a.value - b.value);
                break;
            case TooltipSortOrder.Decreasing:
                parsedBodyLines.sort((a, b) => b.value - a.value);
                break;
        }
        const res = parsedBodyLines.filter(x => {
            var _a;
            return !((_a = this
                .component
                .display
                .getOverrideByLabel(x.seriesName)) === null || _a === void 0 ? void 0 : _a.hideInTooltip);
        });
        return res;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwcC9wbHVnaW5zL3dpZGdldHMvY2hhcnQvc3JjL3ZpZXcvZHJhd2Vycy90b29sdGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFaEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUl4RCxNQUFNLE9BQU8sY0FBYztJQTJDMUIsWUFBcUIsS0FBSyxFQUFVLFNBQXlCO1FBQXhDLFVBQUssR0FBTCxLQUFLLENBQUE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQXpDcEQsT0FBRSxHQUFHLGlCQUFpQixDQUFDO1FBQ3ZCLHFCQUFnQixHQUFHLFlBQVksQ0FBQztJQTBDekMsQ0FBQztJQXhDRCxNQUFNLENBQUMsS0FBSyxDQUFFLElBQW9CO1FBQ2pDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQyxPQUFPO2dCQUNOLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDVixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsT0FBTztZQUNOLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFLFFBQVE7WUFDbEIsSUFBSSxFQUFFLEdBQUc7WUFDVCxTQUFTLEVBQUUsS0FBSztZQUNoQixTQUFTLEVBQUUsQ0FBQztZQUNaLFFBQVEsRUFBRSxFQUFFO1lBQ1osV0FBVyxFQUFFLENBQUM7WUFDZCxVQUFVLEVBQUUsT0FBTztZQUNuQixPQUFPLEVBQUUs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QyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQsTUFBTTtTQUNQO1FBR0QsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsRUFBRTs7WUFDdkMsT0FBTyxRQUFDLElBQUk7aUJBQ1YsU0FBUztpQkFDVCxPQUFPO2lCQUNQLGtCQUFrQixDQUFFLENBQUMsQ0FBQyxVQUFVLENBQUUsMENBQ2pDLGFBQWEsQ0FBQSxDQUFDO1FBQ2xCLENBQUMsQ0FBRSxDQUFBO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb21lbnQgfSBmcm9tICdjb21tb24nO1xyXG5pbXBvcnQgeyBDaGFydENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NoYXJ0LmMnO1xyXG5pbXBvcnQgeyBBWElTX1lfTEVGVCwgVG9vbHRpcFNvcnRPcmRlciB9IGZyb20gJy4uLy4uL2NoYXJ0Lm0nO1xyXG5pbXBvcnQgeyBDb2xvckhlbHBlciB9IGZyb20gJ3VpbGliJztcclxuaW1wb3J0IHsgQXhpc1VuaXRIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL3VuaXQtaGVscGVyJztcclxuXHJcbmRlY2xhcmUgdmFyIENoYXJ0OiBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcEJ1aWxkZXIge1xyXG5cclxuXHRyZWFkb25seSBJRCA9IFwiY2hhcnRqcy10b29sdGlwXCI7XHJcblx0cmVhZG9ubHkgVE9PTFRJUF9TRUxFQ1RPUiA9IFwiZWQtdG9vbHRpcFwiO1xyXG5cclxuXHRzdGF0aWMgYnVpbGQoIGNvbXA6IENoYXJ0Q29tcG9uZW50ICl7XHJcblx0XHRDaGFydC5Ub29sdGlwLnBvc2l0aW9uZXJzLmN1c3RvbSA9IChfLCBldmVudCkgPT4ge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHg6IGV2ZW50LngsXHJcblx0XHRcdFx0eTogZXZlbnQueVxyXG5cdFx0XHR9O1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtb2RlOiAnaW5kZXgnLFxyXG5cdFx0XHRwb3NpdGlvbjogXCJjdXN0b21cIixcclxuXHRcdFx0YXhpczogJ3gnLFxyXG5cdFx0XHRpbnRlcnNlY3Q6IGZhbHNlLFxyXG5cdFx0XHRjYXJldFNpemU6IDAsXHJcblx0XHRcdHhQYWRkaW5nOiAxMCxcclxuXHRcdFx0Ym9keVNwYWNpbmc6IDUsXHJcblx0XHRcdHRpdGxlQWxpZ246ICdyaWdodCcsXHJcblx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxyXG5cdFx0XHRjdXN0b206ICggbW9kZWwgKSA9PiBuZXcgVG9vbHRpcEJ1aWxkZXIoIG1vZGVsLCBjb21wICkuY3JlYXRlKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCByb290KCl7XHJcblx0XHR2YXIgdG9vbHRpcEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5JRCk7XHJcblxyXG5cdFx0Ly8gQ3JlYXRlIGVsZW1lbnQgb24gZmlyc3QgcmVuZGVyXHJcblx0XHRpZighdG9vbHRpcEVsKSB7XHJcblx0XHRcdHRvb2x0aXBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHR0b29sdGlwRWwuaWQgPSB0aGlzLklEO1xyXG5cclxuXHRcdFx0dG9vbHRpcEVsLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPSdncmFwaC10b29sdGlwIGdyYWZhbmEtdG9vbHRpcCAke3RoaXMuVE9PTFRJUF9TRUxFQ1RPUn0nPjwvZGl2PmA7XHJcblxyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXBFbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRvb2x0aXBFbDtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcml2YXRlIG1vZGVsLCBwcml2YXRlIGNvbXBvbmVudDogQ2hhcnRDb21wb25lbnQgKXtcclxuXHJcblx0fVxyXG5cclxuXHRjcmVhdGUoKXtcclxuXHRcdHZhciB0b29sdGlwRWxlbWVudCA9IHRoaXMucm9vdDtcclxuXHJcblx0XHQvLyBIaWRlIGlmIG5vIHRvb2x0aXBcclxuXHRcdGlmKCB0aGlzLm1vZGVsLm9wYWNpdHkgPT09IDAgLyp8fCBjaGFydC5zaG93QW5ub3RWaWV3Ki8gKSB7XHJcblx0XHRcdHRvb2x0aXBFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhYm92ZScsICdiZWxvdycsICduby10cmFuc2Zvcm0nKTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMubW9kZWwueUFsaWduKSB7XHJcblx0XHRcdHRvb2x0aXBFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5tb2RlbC55QWxpZ24pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNmb3JtJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubW9kZWwuYm9keSkge1xyXG5cdFx0XHR0aGlzLmNyZWF0ZUJvZHkoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldFBvc2l0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHNldFBvc2l0aW9uKCl7XHJcblx0XHR2YXIgdG9vbHRpcEVsZW1lbnQgPSB0aGlzLnJvb3Q7XHJcblx0XHRcclxuXHRcdGNvbnN0IGNoYXJ0ID0gdGhpcy5jb21wb25lbnQuY29udHJvbC5jaGFydDtcclxuXHJcblx0XHR2YXIgcG9zaXRpb24gPSBjaGFydFxyXG5cdFx0XHQuY2FudmFzXHJcblx0XHRcdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRjb25zdCBlbFdpZHRoID0gZG9jdW1lbnRcclxuXHRcdFx0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5UT09MVElQX1NFTEVDVE9SKVsgMCBdXHJcblx0XHRcdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cdFx0XHQud2lkdGg7XHJcblxyXG5cdFx0Y29uc3QgbmVnTWFyZ2luID0gKCB0aGlzLm1vZGVsLmNhcmV0WCArIGVsV2lkdGggPiBwb3NpdGlvbi53aWR0aCApID9cclxuXHRcdFx0ZWxXaWR0aCArICAyICogdGhpcy5tb2RlbC54UGFkZGluZyA6IDA7XHJcblx0XHRcclxuXHRcdHRvb2x0aXBFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcblx0XHR0b29sdGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHR0b29sdGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gcG9zaXRpb24ubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIHRoaXMubW9kZWwuY2FyZXRYIC0gbmVnTWFyZ2luICsgJ3B4JztcclxuXHRcdHRvb2x0aXBFbGVtZW50LnN0eWxlLnRvcCA9IHBvc2l0aW9uLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCArIHRoaXMubW9kZWwuY2FyZXRZICsgJ3B4JztcclxuXHRcdHRvb2x0aXBFbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSB0aGlzLm1vZGVsLl9ib2R5Rm9udEZhbWlseTtcclxuXHRcdHRvb2x0aXBFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSB0aGlzLm1vZGVsLnlQYWRkaW5nICsgJ3B4ICcgKyB0aGlzLm1vZGVsLnhQYWRkaW5nICsgJ3B4JztcclxuXHRcdHRvb2x0aXBFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNyZWF0ZUJvZHkoKXtcclxuXHRcdHZhciB0b29sdGlwRWxlbWVudCA9IHRoaXMucm9vdDtcclxuXHRcdHZhciBjaGFydCA9IHRoaXMuY29tcG9uZW50O1xyXG5cdFx0dmFyIHcgPSB0aGlzLmNvbXBvbmVudC5zdG9yZS5wYW5lbC53aWRnZXQ7XHJcblxyXG5cdFx0dmFyIHRpdGxlTGluZXMgPSB0aGlzLm1vZGVsLnRpdGxlIHx8IFtdO1xyXG5cdFx0dmFyIGlubmVySHRtbCA9ICcnO1xyXG5cclxuXHRcdHRpdGxlTGluZXMuZm9yRWFjaChmdW5jdGlvbih0aXRsZSkge1xyXG5cdFx0XHRjb25zdCBkYXRlID0gRGF0ZS5wYXJzZSggdGl0bGUgKTtcclxuXHRcdFx0Y29uc3QgdGltZSA9IE1vbWVudC5mb3JtYXQgKCBkYXRlICk7XHJcblx0XHRcdGlubmVySHRtbCArPSBgPGRpdiBjbGFzcz1cImdyYXBoLXRvb2x0aXAtdGltZVwiPiR7dGltZX08L2Rpdj5gXHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBwYXJzZWRCb2R5TGluZXMgPSB0aGlzLnNvcnQoKTtcclxuXHJcblx0XHRwYXJzZWRCb2R5TGluZXMuZm9yRWFjaCggKGJvZHksIGkpID0+IHtcclxuXHRcdFx0Y29uc3QgeyBzZXJpZXNOYW1lLCB2YWx1ZSwgY29sb3IgfSA9IGJvZHk7XHJcblxyXG5cdFx0XHRsZXQgc2VyaWVzTmFtZUVsID0gYFxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJncmFwaC10b29sdGlwLXNlcmllcy1uYW1lXCI+XHJcblx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLW1pbnVzXCIgc3R5bGU9XCJjb2xvcjoke2NvbG9yfTtcIj48L2k+ICR7c2VyaWVzTmFtZX06XHJcblx0XHRcdFx0PC9kaXY+YFxyXG5cclxuXHRcdFx0Y29uc3QgZHMgPSBjaGFydFxyXG5cdFx0XHRcdC5kYXRhXHJcblx0XHRcdFx0LmRhdGFzZXRzXHJcblx0XHRcdFx0LmZpbmQoIHggPT4geC5sYWJlbCA9PSBzZXJpZXNOYW1lICk7XHJcblxyXG5cdFx0XHRjb25zdCBheGlzID0gICAoIGRzLnlBeGlzSUQgPT0gQVhJU19ZX0xFRlQgKSA/XHR3LmF4ZXMubGVmdFkgOiB3LmF4ZXMucmlnaHRZO1xyXG5cclxuXHRcdFx0Y29uc3QgZGVjaW1hbHMgPSB3LmxlZ2VuZC5kZWNpbWFscyA/IHcubGVnZW5kLmRlY2ltYWxzIDogMTtcclxuXHJcblx0XHRcdGNvbnN0IHJlc1ZhbHVlID0gQXhpc1VuaXRIZWxwZXIuZ2V0Rm9ybWF0dGVkVmFsdWUoIHZhbHVlLCBheGlzLnVuaXQsIGRlY2ltYWxzIClcclxuXHJcblx0XHRcdGxldCB2YWx1ZUVsID0gYDxkaXYgY2xhc3M9XCJncmFwaC10b29sdGlwLXZhbHVlIFwiPiR7cmVzVmFsdWV9PC9kaXY+YDtcclxuXHJcblx0XHRcdGxldCBpdGVtID0gYFxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJncmFwaC10b29sdGlwLWxpc3QtaXRlbVwiPlxyXG5cdFx0XHRcdFx0JHtzZXJpZXNOYW1lRWx9XHJcblx0XHRcdFx0XHQke3ZhbHVlRWx9XHJcblx0XHRcdFx0PC9kaXY+YFxyXG5cclxuXHRcdFx0aW5uZXJIdG1sICs9IGl0ZW07XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgdGFibGVSb290ID0gdG9vbHRpcEVsZW1lbnQucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5UT09MVElQX1NFTEVDVE9SfWApO1xyXG5cdFx0dGFibGVSb290LmlubmVySFRNTCA9IGlubmVySHRtbDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc29ydCgpIDogQXJyYXk8YW55PntcclxuXHRcdGZ1bmN0aW9uIGdldEJvZHkoYm9keUl0ZW0pIHtcclxuXHRcdFx0cmV0dXJuIGJvZHlJdGVtLmxpbmVzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBib2R5TGluZXMgPSB0aGlzLm1vZGVsLmJvZHkubWFwKGdldEJvZHkpO1xyXG5cclxuXHRcdGNvbnN0IHNvcnRPcmRlciA9IHRoaXNcclxuXHRcdFx0LmNvbXBvbmVudFxyXG5cdFx0XHQud2lkZ2V0XHJcblx0XHRcdC5kaXNwbGF5XHJcblx0XHRcdC50b29sdGlwU29ydE9yZGVyO1xyXG5cclxuXHRcdGNvbnN0IHBhcnNlZEJvZHlMaW5lcyA9IFtdO1xyXG5cdFx0XHJcblx0XHRib2R5TGluZXMuZm9yRWFjaCgoYm9keSwgaSkgPT4ge1xyXG5cdFx0XHR2YXIgY29sb3JzID0gdGhpcy5tb2RlbC5sYWJlbENvbG9yc1sgaSBdO1xyXG5cdFx0XHR2YXIgY29sb3IgPSBDb2xvckhlbHBlci5oZXhUb1JnYlN0cmluZyggY29sb3JzLmJhY2tncm91bmRDb2xvcik7XHJcblxyXG5cdFx0XHRsZXQgaW5kZXggPSBib2R5WyAwIF0ubGFzdEluZGV4T2YoICc6JyApO1xyXG5cdFx0XHRjb25zdCBzZXJpZXNOYW1lID0gYm9keVsgMCBdLnN1YnN0cmluZyggMCwgaW5kZXggKTtcclxuXHRcdFx0Y29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMubW9kZWwuZGF0YVBvaW50c1sgaSBdLnZhbHVlKTtcclxuXHRcdFx0cGFyc2VkQm9keUxpbmVzLnB1c2goIHtzZXJpZXNOYW1lLCB2YWx1ZSwgY29sb3J9ICk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzd2l0Y2goIHNvcnRPcmRlciApe1xyXG5cdFx0XHRjYXNlIFRvb2x0aXBTb3J0T3JkZXIuSW5jcmVhc2luZzpcclxuXHRcdFx0XHRwYXJzZWRCb2R5TGluZXMuc29ydCggKGEsIGIpID0+IGEudmFsdWUgLSBiLnZhbHVlKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgVG9vbHRpcFNvcnRPcmRlci5EZWNyZWFzaW5nOlxyXG5cdFx0XHRcdHBhcnNlZEJvZHlMaW5lcy5zb3J0KCAoYSwgYikgPT4gYi52YWx1ZSAtIGEudmFsdWUpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRjb25zdCByZXMgPSBwYXJzZWRCb2R5TGluZXMuZmlsdGVyKCB4ID0+IHtcclxuXHRcdFx0cmV0dXJuICF0aGlzXHJcblx0XHRcdFx0LmNvbXBvbmVudFxyXG5cdFx0XHRcdC5kaXNwbGF5XHJcblx0XHRcdFx0LmdldE92ZXJyaWRlQnlMYWJlbCggeC5zZXJpZXNOYW1lIClcclxuXHRcdFx0XHQ/LmhpZGVJblRvb2x0aXA7XHJcblx0XHR9IClcclxuXHJcblx0XHRyZXR1cm4gcmVzO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbiJdfQ==